import 'reflect-metadata';
import { AppService } from '../services/appService';
import { AppServiceInfo, AppServiceLifetime } from '../services/appServiceInfo';
import { AppServiceInfoRegistry } from '../services/appServiceInfoRegistry';
import { AppServiceMetadata, Priority } from '../services/appServiceMetadata';
import { AbstractType, Type } from '../type';
import { Injector } from './injector';
import { InjectionError } from './injectionError';

/**
 * Provides a container for the dependency injection.
 *
 * @export
 * @class LiteInjector
 */
@AppService({ overridePriority: Priority.Low, provider: _ => Injector.instance })
export class LiteInjector extends Injector {
  private _registry: AppServiceInfoRegistry;
  private _singletons = new WeakMap<AbstractType, any>();

  /**
   * Creates an instance of LiteInjector.
   * @param {AppServiceInfoRegistry} [registry]
   * @memberof LiteInjector
   */
  constructor(registry?: AppServiceInfoRegistry) {
    super();
    this._registry = registry || (registry = AppServiceInfoRegistry.Instance);
    if (registry !== AppServiceInfoRegistry.Instance) {
      const appServiceInfo = new AppServiceInfo({
        contractType: Injector,
        allowMultiple: false,
        lifetime: AppServiceLifetime.Singleton,
      });
      registry.registerServiceContract(Injector, appServiceInfo);
      registry.registerService(LiteInjector, new AppServiceMetadata({
        overridePriority: Priority.Low,
        _serviceContract: appServiceInfo, // HACK: set the background field of serviceContract
        serviceType: LiteInjector,
        serviceInstance: this,
      }))
    }
  }

  /**
   * Gets the service instance of the required service contract type.
   *
   * @template T
   * @param {Type<T>} type The service contract type.
   * @param notFoundResolver A resolver for the case when a type cannot be resolved.
   * @returns {T} The requested service.
   * @memberof LiteInjector
   */
  public resolve<T>(type: Type<T> | AbstractType, notFoundResolver?: (type: Type<T> | AbstractType) => any): T {
    const serviceInfo = notFoundResolver ? this._tryGetServiceContract(type) : this._getServiceContract(type);
    if (!serviceInfo) {
      return notFoundResolver!(type);
    }

    if (serviceInfo.lifetime === AppServiceLifetime.Singleton) {
      let service = this._singletons.get(type);
      if (!service) {
        const serviceMetadata = this._getSingleServiceMetadata(serviceInfo);
        service = this._createInstance(serviceMetadata, notFoundResolver);
        this._singletons.set(type, service);
      }
      return service;
    }
    else {
      return this._createInstance(this._getSingleServiceMetadata(serviceInfo), notFoundResolver);
    }
  }

  /**
   * Gets an array of service instances.
   *
   * @template T
   * @param {Type<T>} type The service contract type.
   * @param notFoundResolver A resolver for the case when a type cannot be resolved.
   * @returns {T[]} The array of the requested service.
   * @memberof LiteInjector
   */
  public resolveMany<T>(type: Type<T> | AbstractType, notFoundResolver?: (type: Type<T> | AbstractType) => any): T[] {
    const serviceInfo = notFoundResolver ? this._tryGetServiceContract(type) : this._getServiceContract(type);
    if (!serviceInfo) {
      // the resolver should know that it should return an array of items.
      return notFoundResolver!(type);
    }

    if (serviceInfo.lifetime === AppServiceLifetime.Singleton) {
      let services = this._singletons.get(type);
      if (services === undefined || services === null) {
        services = [...serviceInfo.services].map(s => this._createInstance(s, notFoundResolver));
        this._singletons.set(type, services);
      }
      return services;
    }
    else {
      return [...serviceInfo.services].map(s => this._createInstance(s, notFoundResolver));
    }
  }

  private _tryGetServiceContract(type: AbstractType): AppServiceInfo | null {
    return this._registry.getServiceContract(type);
  }

  private _getServiceContract(type: AbstractType): AppServiceInfo {
    const serviceInfo = this._registry.getServiceContract(type);
    if (!serviceInfo) {
      throw new InjectionError(`The type '${type.name}' is not registered as a service contract.`);
    }

    return serviceInfo;
  }

  private _getSingleServiceMetadata(serviceInfo: AppServiceInfo): AppServiceMetadata<any> {
    const services = [...serviceInfo.services];
    if (services.length === 0) {
      throw new InjectionError(`The service contract '${serviceInfo.contractType.name}' does not have any services registered.`);
    }

    if (services.length > 1) {
      throw new InjectionError(`The service contract '${serviceInfo.contractType.name}' has multiple services registered: '${services.join("', '")}'.`);
    }

    return services[0];
  }

  private _createInstance<T>(serviceMetadata: AppServiceMetadata<any>, notFoundResolver?: (type: Type<T> | AbstractType) => any): any {
    if (serviceMetadata.serviceInstance) {
      return serviceMetadata.serviceInstance;
    }

    if (serviceMetadata.serviceFactory) {
      return serviceMetadata.serviceFactory(this);
    }

    const serviceType = serviceMetadata.serviceType!;
    const paramTypes: Type<any>[] = Reflect.getOwnMetadata('design:paramtypes', serviceType);
    if (paramTypes) {
      const ctorArgs = paramTypes.map(t => this.resolve(t, notFoundResolver));
      return new serviceType(...ctorArgs);
    }

    return new serviceType();
  }
}

// make sure the injector is set.
if (!Injector.instance) {
  Injector.instance = new LiteInjector();
}
