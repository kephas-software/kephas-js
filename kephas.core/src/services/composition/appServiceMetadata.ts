import { AppServiceInfo } from "../appServiceInfo";

/**
 * Metadata for application services.
 *
 * @export
 * @class AppServiceMetadata
 */
export class AppServiceMetadata {
    /**
     * Gets the override priority.
     *
     * @type {number}
     * @memberof AppServiceInfo
     */
    public readonly overridePriority: number = 0;

    /**
     * Gets the processing priority.
     *
     * @type {number}
     * @memberof AppServiceInfo
     */
    public readonly processingPriority: number = 0;

    /**
     * Gets the service name.
     *
     * @type {string}
     * @memberof AppServiceMetadata
     */
    public readonly serviceName?: string;

    /**
     * Gets the implementation type.
     *
     * @type {Function}
     * @memberof AppServiceMetadata
     */
    public implementationType?: Function;

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
     * @param {number} [overridePriority=0] Optional. The override priority.
     * @param {number} [processingPriority=0] Optional. The processing priority.
     * @param {string} [serviceName] Optional. The service name.
     * @param {Function} [implementationType] Optional. The implementation type.
     * @memberof AppServiceMetadata
     */
    constructor({ overridePriority = 0, processingPriority = 0, serviceName, implementationType }: { overridePriority?: number; processingPriority?: number; serviceName?: string; implementationType?: Function; } = {}) {
        this.overridePriority = overridePriority;
        this.processingPriority = processingPriority;
        this.serviceName = serviceName;
        this.implementationType = implementationType;
    }
}