import { AppServiceInfo } from "../appServiceInfo";
import { Type } from "../../type";

/**
 * Enumerates the priority values.
 * They are practically a convenient way to provide integer values for defining priorities.
 * A lower value indicates a higher priority.
 *
 * @export
 * @enum {number}
 */
export enum Priority {
    /**
     * The lowest priority. Typically used by the null services.
     */
    Lowest = 2147483647,

    /**
    * The low priority. Typically used by the default services.
    */
    Low = 1000000,

    /**
     * The below normal priority. Typically used by services with a higher specialization than the default ones.
     */
    BelowNormal = 1000,

    /**
     * The normal priority (the default).
     */
    Normal = 0,

    /**
     * The above normal priority.
     */
    AboveNormal = -1000,

    /**
     * The high priority.
     */
    High = -1000000,

    /**
     * The highest priority.
     */
    Highest = -2147483648,
}

/**
 * Metadata for application services.
 *
 * @export
 * @class AppServiceMetadata
 */
export class AppServiceMetadata<T> {
    /**
     * Gets the override priority.
     *
     * @type {number}
     * @memberof AppServiceInfo
     */
    public readonly overridePriority: number = Priority.Normal;

    /**
     * Gets the processing priority.
     *
     * @type {number}
     * @memberof AppServiceInfo
     */
    public readonly processingPriority: number = Priority.Normal;

    /**
     * Gets the service name.
     *
     * @type {string}
     * @memberof AppServiceMetadata
     */
    public readonly serviceName?: string;

    /**
     * Gets the service implementation type.
     *
     * @type {Function}
     * @memberof AppServiceMetadata
     */
    public serviceType?: Type<T>;

    /**
     * Gets the application service contract.
     *
     * @type {AppServiceInfo}
     * @memberof AppServiceMetadata
     */
    public serviceContract?: AppServiceInfo;

    /**
     * Creates an instance of AppServiceMetadata.
     * 
     * @param {number|Priority} [overridePriority=Priority.Normal] Optional. The override priority.
     * @param {number|Priority} [processingPriority=Priority.Normal] Optional. The processing priority.
     * @param {string} [serviceName] Optional. The service name.
     * @param {Type<T>} [serviceType] Optional. The service implementation type.
     * @memberof AppServiceMetadata
     */
    constructor(
        {
            overridePriority = Priority.Normal,
            processingPriority = Priority.Normal,
            serviceName,
            serviceType
        }: {
            overridePriority?: number | Priority;
            processingPriority?: number | Priority;
            serviceName?: string;
            serviceType?: Type<T>;
        } = {}) {
        this.overridePriority = overridePriority;
        this.processingPriority = processingPriority;
        this.serviceName = serviceName;
        this.serviceType = serviceType;
    }
}