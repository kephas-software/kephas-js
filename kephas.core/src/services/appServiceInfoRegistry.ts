import { Sealed } from "..";
import { AppServiceInfo, AppServiceLifetime } from "..";
import { ServiceError } from "..";
import { Requires } from "..";
import { AppServiceMetadata, Priority } from "..";
import { AppServiceContract, SingletonAppServiceContract } from "..";
import { AbstractType, Type } from "..";
import 'reflect-metadata';

interface IAppServiceInfo {
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
    registerService<T>(service: AppServiceMetadata<T>): boolean | ServiceError | AppServiceMetadata<any>;
}

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

    private static readonly _serviceContractKey = "kephas:serviceContract";
    private static readonly _serviceMetadataKey = "kephas:serviceMetadata";

    private readonly _serviceContracts: AppServiceInfo[];
    private readonly _services: AppServiceMetadata<any>[];

    /**
     * Creates an instance of AppServiceInfoRegistry.
     * @memberof AppServiceInfoRegistry
     */
    constructor() {
        this._serviceContracts = [];
        this._services = [];

        this.registerServiceContract(AppServiceInfoRegistry, new AppServiceInfo(
            {
                contractType: AppServiceInfoRegistry,
                lifetime: AppServiceLifetime.Singleton
            }));
        this.registerService(AppServiceInfoRegistry, new AppServiceMetadata(
            {
                overridePriority: Priority.Low,
                serviceType: AppServiceInfoRegistry,
                serviceInstance: this,
            }));
    }

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
    public get services(): IterableIterator<AppServiceMetadata<any>> {
        return this._services.values();
    }

    /**
    * Registers the provided type as a service contract.
    *
    * @static
    * @param {AbstractType} type The type to be registered.
    * @param {AppServiceInfo} appServiceInfo The service information.
    * @memberof AppServiceInfoRegistry
    */
    public registerServiceContract(type: AbstractType, appServiceInfo: AppServiceInfo): this {
        Requires.HasValue(type, 'type');
        Reflect.defineMetadata(AppServiceInfoRegistry._serviceContractKey, appServiceInfo, type);
        this._serviceContracts.push(appServiceInfo);
        return this;
    }

    /**
    * Registers the provided type as a service type.
    *
    * @static
    * @param {Type<T>} type The type to be registered.
    * @param {AppServiceMetadata} [metadata] Optional. The service metadata.
    * @memberof AppServiceInfoRegistry
    */
    public registerService<T>(type: Type<T>, metadata?: AppServiceMetadata<T>): this {
        Requires.HasValue(type, 'type');
        let appServiceInfo = this._getContractOfService(type);
        if (!appServiceInfo) {
            throw new ServiceError(`The service contract for '${type.name}' could not be identified. Check that the service or one of its bases is decorated as ${AppServiceContract.name} or ${SingletonAppServiceContract.name}.`);
        }

        metadata = metadata || new AppServiceMetadata();
        metadata["_serviceType"] = type;
        metadata["_serviceContract"] = appServiceInfo;

        let result = (<IAppServiceInfo><unknown>appServiceInfo).registerService(metadata);
        if (result instanceof ServiceError) {
            throw result;
        }

        if (result instanceof AppServiceMetadata) {
            let overriddenServiceType = result.serviceType;
            let overriddenIndex = this._services.findIndex(m => m.serviceType == overriddenServiceType);
            if (overriddenIndex >= 0) {
                this._services[overriddenIndex] = metadata;
            }
            result = true;
        }
        else if (result) {
            this._services.push(metadata);
        }

        if (result) {
            Reflect.defineMetadata(AppServiceInfoRegistry._serviceContractKey, appServiceInfo, type);
            Reflect.defineMetadata(AppServiceInfoRegistry._serviceMetadataKey, metadata, type);
        }

        return this;
    }

    /**
     * Gets the service contract from the provided type, if possible.
     *
     * @param {AbstractType} type The type assumed to be a service contract or a service type.
     * @returns {(AppServiceInfo | null)} The AppServiceInfo instance or null, if the type is not a service contract.
     * @memberof AppServiceInfoRegistry
     */
    public getServiceContract(type: AbstractType): AppServiceInfo | null {
        Requires.HasValue(type, 'type');
        return Reflect.getOwnMetadata(AppServiceInfoRegistry._serviceContractKey, type) as AppServiceInfo || null;
    }

    /**
     * Gets a value indicating whether a type is a service contract.
     *
     * @param {AbstractType} type The type assumed to be a service contract.
     * @returns {boolean}
     * @memberof AppServiceInfoRegistry
     */
    public isServiceContract(type: AbstractType): boolean {
        Requires.HasValue(type, 'type');
        return Reflect.hasOwnMetadata(AppServiceInfoRegistry._serviceContractKey, type);
    }

    /**
     * Gets the service metadata from the provided type, if possible.
     *
     * @param {AbstractType} type The type assumed to be a service type.
     * @returns {(AppServiceMetadata | null)}
     * @memberof AppServiceInfoRegistry
     */
    public getServiceMetadata(type: AbstractType): AppServiceMetadata<any> | null {
        Requires.HasValue(type, 'type');
        return Reflect.getOwnMetadata(AppServiceInfoRegistry._serviceMetadataKey, type) as AppServiceMetadata<any> || null;
    }

    /**
     * Gets a value indicating whether a type is a service.
     *
     * @param {AbstractType} type
     * @returns {boolean}
     * @memberof AppServiceInfoRegistry
     */
    public isService(type: AbstractType): boolean {
        Requires.HasValue(type, 'type');
        return Reflect.hasOwnMetadata(AppServiceInfoRegistry._serviceMetadataKey, type);
    }

    private _getContractOfService(type: AbstractType): AppServiceInfo | null {
        while (type) {
            let contract = this.getServiceContract(type);
            if (contract) {
                return contract;
            }

            const typePrototype = Object.getPrototypeOf(type.prototype);
            type = typePrototype && typePrototype.constructor;
        }

        return null;
    }
}