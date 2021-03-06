import {
    Type, AppServiceInfoRegistry, AppService,
    Priority, AbstractType, AppServiceInfo, AppServiceLifetime,
    AppServiceMetadata, CompositionError, CompositionContext } from '..';

import 'reflect-metadata';

/**
 * Provides a container for the dependency injection.
 *
 * @export
 * @class CompositionContext
 */
@AppService({ overridePriority: Priority.Low, provider: _ => LiteCompositionContext.Instance })
export class LiteCompositionContext extends CompositionContext {
    private static _instance: CompositionContext;
    private _registry: AppServiceInfoRegistry;
    private _singletons = new WeakMap<AbstractType, any>();

    /**
     * Gets the static instance of the CompositionContext.
     *
     * @readonly
     * @static
     * @type {CompositionContext}
     * @memberof CompositionContext
     */
    public static get Instance() : CompositionContext {
        return LiteCompositionContext._instance
            ? LiteCompositionContext._instance
            : (LiteCompositionContext._instance = new LiteCompositionContext());
    }

    /**
     * Creates an instance of CompositionContext.
     * @param {AppServiceInfoRegistry} [registry]
     * @memberof CompositionContext
     */
    constructor(registry?: AppServiceInfoRegistry) {
        super();
        this._registry = registry || (registry = AppServiceInfoRegistry.Instance);
        if (registry !== AppServiceInfoRegistry.Instance) {
            const appServiceInfo = new AppServiceInfo({
                contractType: CompositionContext,
                allowMultiple: false,
                lifetime: AppServiceLifetime.Singleton,
            });
            registry.registerServiceContract(CompositionContext, appServiceInfo);
            registry.registerService(LiteCompositionContext, new AppServiceMetadata({
                overridePriority: Priority.Low,
                _serviceContract: appServiceInfo, // HACK: set the background field of serviceContract
                serviceType: LiteCompositionContext,
                serviceInstance: this,
            }))
        }
    }

    /**
     * Gets the service instance of the required service contract type.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T} The requested service.
     * @memberof CompositionContext
     */
    public get<T>(type: Type<T> | AbstractType): T {
        const serviceInfo = this._getServiceContract(type);
        if (serviceInfo.lifetime === AppServiceLifetime.Singleton) {
            let service = this._singletons.get(type);
            if (!service) {
                const serviceMetadata = this._getSingleServiceMetadata(serviceInfo);
                service = this._createInstance(serviceMetadata);
                this._singletons.set(type, service);
            }
            return service;
        }
        else {
            return this._createInstance(this._getSingleServiceMetadata(serviceInfo));
        }
    }

    /**
     * Gets an array of service instances.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T[]} The array of the requested service.
     * @memberof CompositionContext
     */
    public getMultiple<T>(type: Type<T> | AbstractType): T[] {
        const serviceInfo = this._getServiceContract(type);
        if (serviceInfo.lifetime === AppServiceLifetime.Singleton) {
            let services = this._singletons.get(type);
            if (services === undefined || services === null) {
                services = [...serviceInfo.services].map(s => this._createInstance(s));
                this._singletons.set(type, services);
            }
            return services;
        }
        else {
            return [...serviceInfo.services].map(s => this._createInstance(s));
        }
    }

    private _getServiceContract(type: AbstractType): AppServiceInfo {
        const serviceInfo = this._registry.getServiceContract(type);
        if (!serviceInfo) {
            throw new CompositionError(`The type '${type.name}' is not registered as a service contract.`);
        }

        return serviceInfo;
    }

    private _getSingleServiceMetadata(serviceInfo: AppServiceInfo): AppServiceMetadata<any> {
        const services = [...serviceInfo.services];
        if (services.length === 0) {
            throw new CompositionError(`The service contract '${serviceInfo.contractType.name}' does not have any services registered.`);
        }

        if (services.length > 1) {
            throw new CompositionError(`The service contract '${serviceInfo.contractType.name}' has multiple services registered: '${services.join("', '")}'.`);
        }

        return services[0];
    }

    private _createInstance(serviceMetadata: AppServiceMetadata<any>): any {
        if (serviceMetadata.serviceInstance) {
            return serviceMetadata.serviceInstance;
        }

        if (serviceMetadata.serviceFactory) {
            return serviceMetadata.serviceFactory(this);
        }

        const serviceType = serviceMetadata.serviceType!;
        const paramTypes: Type<any>[] = Reflect.getOwnMetadata('design:paramtypes', serviceType);
        if (paramTypes) {
            const ctorArgs = paramTypes.map(t => this.get(t));
            return new serviceType(...ctorArgs);
        }

        return new serviceType();
    }
}