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
     * Gets or sets a value indicating whether multiple services for this contract are allowed.
     *
     * @type {boolean}
     * @memberof AppServiceInfo
     */
    public allowMultiple: boolean = false;

    /**
     * Gets the application service lifetime.
     *
     * @type {AppServiceLifetime}
     * @memberof AppServiceInfo
     */
    public lifetime: AppServiceLifetime = AppServiceLifetime.Singleton;

    /**
     * Gets or sets the contract type of the service.
     *
     * @type {Function}
     * @memberof AppServiceInfo
     */
    public contractType: Function;

    /**
     * Creates an instance of AppServiceInfo.
     * @param {Function} contractType The contract type.
     * @param {boolean} [allowMultiple=false] Indicates whether multiple instances of the provided
     * @param {AppServiceLifetime} [lifetime=AppServiceLifetime.Singleton] The application service lifetime.
     * @memberof AppServiceInfo
     */
    constructor(contractType: Function, allowMultiple = false, lifetime: AppServiceLifetime = AppServiceLifetime.Singleton) {
        this.contractType = contractType;
        this.allowMultiple = allowMultiple;
        this.lifetime = lifetime;
    }
}