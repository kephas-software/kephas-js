import { Sealed } from "../sealed";
import { AppServiceInfo } from "./appServiceInfo";
import { ServiceError } from "./serviceError";
import { Requires } from "../diagnostics/contracts/requires";

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

    /**
     * Gets the registered service contracts.
     *
     * @static
     * @type {AppServiceInfo[]}
     * @memberof AppServiceInfoRegistry
     */
    public readonly serviceContracts: AppServiceInfo[] = [];

    /**
     * Gets the registered services.
     *
     * @type {Function[]}
     * @memberof AppServiceInfoRegistry
     */
    public readonly services: Function[] = [];

    private readonly _serverRegistrationBehaviors: { (ctor: Function): any }[] = [];

    /**
    * Registers the provided type as a service contract.
    *
    * @static
    * @param {Function} ctor The type to be registered.
    * @param {AppServiceInfo} appServiceInfo The service information.
    * @memberof AppServiceInfoRegistry
    */
    public registerServiceContract(ctor: Function, appServiceInfo: AppServiceInfo) {
        ctor["__appServiceInfo"] = appServiceInfo;
        ctor["__appServiceInfoIndex"] = this.serviceContracts.length;
        this.serviceContracts.push(appServiceInfo);
    }

    /**
     * Gets the provided type as a service contract.
     *
     * @static
     * @param {Function} ctor The type to be registered.
     * @param {AppServiceInfo} appServiceInfo The service information.
     * @memberof AppServiceInfoRegistry
     */
    public getServiceContract(ctor: Function): AppServiceInfo | null {
        return ctor["__appServiceInfo"] as AppServiceInfo || null;
    }

    /**
    * Registers the provided type as a service type.
    *
    * @static
    * @param {Function} ctor The type to be registered.
    * @memberof AppServiceInfoRegistry
    */
    public registerServiceType(ctor: Function) {
        let contractType = this._getContractTypeOfServiceType(ctor);
        if (!contractType) {
            throw new ServiceError(`The service contract for '${ctor.name}' could not be identified. Check that the service or one of its bases is decorated as AppServiceContract or SingletonAppServiceContract.`);
        }

        this.services.push(ctor);
        for (let behavior of this._serverRegistrationBehaviors) {
            behavior(ctor);
        }
    }

    /**
     * Adds a service registration behavior. These behaviors should be added before any registration occurs,
     * otherwise they will be applied only to a part of the registrations.
     *
     * @param {{ (ctor: Function): any }} behavior
     * @memberof AppServiceInfoRegistry
     */
    public addServiceRegistrationBehavior(behavior: { (ctor: Function): any }) {
        Requires.HasValue(behavior, 'behavior');
        this._serverRegistrationBehaviors.push(behavior);
    }

    private _getContractTypeOfServiceType(ctor: Function): Function | null {
        while (ctor) {
            let contract = this.getServiceContract(ctor);
            if (contract) {
                return ctor;
            }

            ctor = Object.getPrototypeOf(ctor.prototype)?.constructor;
        }

        return null;
    }
}