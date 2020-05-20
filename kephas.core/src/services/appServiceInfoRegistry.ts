import { Sealed } from "../sealed";
import { AppServiceInfo } from "./appServiceInfo";
import { ServiceError } from "./serviceError";
import { Requires } from "../diagnostics/contracts/requires";
import { AppServiceMetadata } from "./composition/appServiceMetadata";

/**
 * Registry for the application service information.
 *
 * @export
 * @class AppServiceInfoRegistry
 */
@Sealed
export class AppServiceInfoRegistry {
    /**
     * Gets the static instance of the registry.
     *
     * @static
     * @memberof AppServiceInfoRegistry
     */
    public static readonly Instance = new AppServiceInfoRegistry();

    private static readonly _serviceContractKey = "__serviceContract";
    private static readonly _serviceMetadataKey = "__serviceMetadata";

    private readonly _serviceContracts: AppServiceInfo[] = [];
    private readonly _services: AppServiceMetadata[] = [];

    /**
     * Gets an iterator over service contracts.
     *
     * @returns {IterableIterator<AppServiceInfo>} The iterator over service contracts.
     * @memberof AppServiceInfoRegistry
     */
    public get serviceContracts(): IterableIterator<AppServiceInfo> {
        return this._serviceContracts.values();
    }

    /**
     * Gets an iterator of services.
     *
     * @readonly
     * @type {IterableIterator<AppServiceMetadata>} The iterator over services.
     * @memberof AppServiceInfoRegistry
     */
    public get services(): IterableIterator<AppServiceMetadata> {
        return this._services.values();
    }

    /**
    * Registers the provided type as a service contract.
    *
    * @static
    * @param {Function} ctor The type to be registered.
    * @param {AppServiceInfo} appServiceInfo The service information.
    * @memberof AppServiceInfoRegistry
    */
    public registerServiceContract(ctor: Function, appServiceInfo: AppServiceInfo) {
        Requires.HasValue(ctor, 'ctor');
        ctor[AppServiceInfoRegistry._serviceContractKey] = appServiceInfo;
        this._serviceContracts.push(appServiceInfo);
    }

    /**
    * Registers the provided type as a service type.
    *
    * @static
    * @param {Function} ctor The type to be registered.
    * @param {AppServiceMetadata} [metadata] Optional. The service metadata.
    * @memberof AppServiceInfoRegistry
    */
    public registerServiceType(ctor: Function, metadata?: AppServiceMetadata) {
        Requires.HasValue(ctor, 'ctor');
        let appServiceInfo = this._getContractOfService(ctor);
        if (!appServiceInfo) {
            throw new ServiceError(`The service contract for '${ctor.name}' could not be identified. Check that the service or one of its bases is decorated as AppServiceContract or SingletonAppServiceContract.`);
        }

        metadata = metadata ?? new AppServiceMetadata();
        metadata.implementationType = ctor;
        metadata.serviceContract = appServiceInfo;

        let result = appServiceInfo.registerService(metadata);
        if (result instanceof ServiceError) {
            throw result;
        }

        if (result) {
            ctor[AppServiceInfoRegistry._serviceContractKey] = appServiceInfo;
            ctor[AppServiceInfoRegistry._serviceMetadataKey] = metadata;
            this._services.push(metadata);
        }
    }

    /**
     * Gets the service contract from the provided type, if possible.
     *
     * @param {Function} ctor The type assumed to be a service contract or a service type.
     * @returns {(AppServiceInfo | null)} The AppServiceInfo instance or null, if the type is not a service contract.
     * @memberof AppServiceInfoRegistry
     */
    public getServiceContract(ctor: Function): AppServiceInfo | null {
        return ctor[AppServiceInfoRegistry._serviceContractKey] as AppServiceInfo || null;
    }

    /**
     * Gets a value indicating whether a type is a service contract.
     *
     * @param {Function} ctor
     * @returns {boolean}
     * @memberof AppServiceInfoRegistry
     */
    public isServiceContract(ctor: Function): boolean {
        return !!ctor[AppServiceInfoRegistry._serviceContractKey];
    }

    /**
     * Gets the service metadata from the provided type, if possible.
     *
     * @param {Function} ctor The type assumed to be a service type.
     * @returns {(AppServiceMetadata | null)}
     * @memberof AppServiceInfoRegistry
     */
    public getServiceMetadata(ctor: Function): AppServiceMetadata | null {
        return ctor[AppServiceInfoRegistry._serviceMetadataKey] as AppServiceMetadata || null;
    }

    /**
     * Gets a value indicating whether a type is a service.
     *
     * @param {Function} ctor
     * @returns {boolean}
     * @memberof AppServiceInfoRegistry
     */
    public isService(ctor: Function): boolean {
        return !!ctor[AppServiceInfoRegistry._serviceMetadataKey];
    }

    private _getContractOfService(ctor: Function): AppServiceInfo | null {
        while (ctor) {
            let contract = this.getServiceContract(ctor);
            if (contract) {
                return contract;
            }

            ctor = Object.getPrototypeOf(ctor.prototype)?.constructor;
        }

        return null;
    }
}