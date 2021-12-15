import { Expando } from "../expando";
import { AbstractType } from "../type";
import { AppServiceMetadata } from "./appServiceMetadata";
import { ServiceError } from "./serviceError";

/**
 * Enumerates the lifetime values for application services.
 *
 * @export
 * @enum {number}
 */
export enum AppServiceLifetime {
    /**
     * The application service is shared (default).
     */
    Singleton,

    /**
     * The application service in instantiated with every request.
     */
    Transient,

    /**
     * The application service is shared within a scope.
     */
    Scoped,
}

/**
 * Provides information about the application service.
 *
 * @export
 * @class AppServiceInfo
 */
export class AppServiceInfo implements Expando {
    /**
     * Gets a value indicating whether multiple services for this contract are allowed.
     *
     * @type {boolean}
     * @memberof AppServiceInfo
     */
    public readonly allowMultiple: boolean = false;

    /**
     * Gets the application service lifetime.
     *
     * @type {AppServiceLifetime}
     * @memberof AppServiceInfo
     */
    public readonly lifetime: AppServiceLifetime = AppServiceLifetime.Singleton;

    /**
     * Gets the contract type of the service.
     *
     * @type {AbstractType}
     * @memberof AppServiceInfo
     */
    public readonly contractType: AbstractType;

    /**
     * Gets the contract token of the service.
     *
     * @type {*}
     * @memberof AppServiceInfo
     */
    public readonly contractToken: any;

    /**
     * Gets an iteration of registered services.
     *
     * @readonly
     * @type {IterableIterator<AppServiceMetadata>}
     * @memberof AppServiceInfo
     */
    public get services(): IterableIterator<AppServiceMetadata<any>> {
        return this._services.values();
    }

    private _services: AppServiceMetadata<any>[] = [];

    /**
     * Creates an instance of AppServiceInfo.
     * @param {Type<T>} contractType The contract type.
     * @param {*} contractToken The contract token.
     * @param {boolean} [allowMultiple=false] Indicates whether multiple instances of the provided
     * @param {AppServiceLifetime} [lifetime=AppServiceLifetime.Singleton] The application service lifetime.
     * @memberof AppServiceInfo
     */
    constructor(
        {
            contractType,
            contractToken,
            allowMultiple = false,
            lifetime = AppServiceLifetime.Singleton,
            ...args
        }: {
            contractType: AbstractType;
            contractToken?: any;
            allowMultiple?: boolean;
            lifetime?: AppServiceLifetime;
            [key: string]: any;
        }) {
        this.contractType = contractType;
        this.contractToken = contractToken;
        this.allowMultiple = allowMultiple;
        this.lifetime = lifetime;
        Object.assign(this, args);
    }

    /**
     * Registers a service implementation for this contract.
     *
     * @template T The service implementation type.
     * @param {AppServiceMetadata<T>} service
     * @returns {(boolean | ServiceError | AppServiceMetadata<any>)}
     * True, if the service was registered successfully.
     * False, if the service was not registered due to a higher override priority service already registered.
     * ServiceError, if a service is already registered with the same override priority.
     * AppServiceMetadata<any>, if the service to register overrid an existing one. The overridden service is returned.
     * @memberof AppServiceInfo
     */
    private registerService<T>(service: AppServiceMetadata<T>): boolean | ServiceError | AppServiceMetadata<any> {
        if (this.allowMultiple) {
            this._services.push(service);
            return true;
        }

        if (this._services.length > 0) {
            if (this._services[0].overridePriority > service.overridePriority) {
                const overridden = this._services[0];
                this._services[0] = service;
                return overridden;
            }

            if (this._services[0].overridePriority === service.overridePriority) {
                const firstServiceType = this._services[0].serviceType;
                return new ServiceError(`Multiple services registered with the same override priority '${service.overridePriority}' as singleton: '${firstServiceType && firstServiceType.name}' and '${service.serviceType && service.serviceType.name}'.`);
            }

            return false;
        }

        this._services.push(service);
        return true;
    }
}
