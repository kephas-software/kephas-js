import { AppServiceMetadata } from "./composition/appServiceMetadata";
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
export class AppServiceInfo {
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
     * @type {Function}
     * @memberof AppServiceInfo
     */
    public readonly contractType: Function;

    /**
     * Gets an iteration of registered services.
     *
     * @readonly
     * @type {IterableIterator<AppServiceMetadata>}
     * @memberof AppServiceInfo
     */
    public get services(): IterableIterator<AppServiceMetadata> {
        return this._services.values();
    }

    private _services: AppServiceMetadata[] = [];

    /**
     * Creates an instance of AppServiceInfo.
     * @param {Function} contractType The contract type.
     * @param {boolean} [allowMultiple=false] Indicates whether multiple instances of the provided
     * @param {AppServiceLifetime} [lifetime=AppServiceLifetime.Singleton] The application service lifetime.
     * @memberof AppServiceInfo
     */
    constructor({ contractType, allowMultiple = false, lifetime = AppServiceLifetime.Singleton }: { contractType: Function; allowMultiple?: boolean; lifetime?: AppServiceLifetime; }) {
        this.contractType = contractType;
        this.allowMultiple = allowMultiple;
        this.lifetime = lifetime;
    }

    /**
     * Registers a service implementation for this contract.
     *
     * @param {AppServiceMetadata} service
     * @memberof AppServiceInfo
     */
    public registerService(service: AppServiceMetadata): boolean | ServiceError {
        if (this.allowMultiple) {
            this._services.push(service);
            return true;
        }

        if (this._services.length > 0) {
            if (this._services[0].overridePriority > service.overridePriority) {
                this._services[0] = service;
                return true;
            }

            if (this._services[0].overridePriority == service.overridePriority) {
                return new ServiceError(`Multiple services registered with the same override priority '${service.overridePriority}' as singleton: '${this._services[0].implementationType?.name}' and '${service.implementationType?.name}'.`);
            }

            return false;
        }

        this._services.push(service);
        return true;
    }
}