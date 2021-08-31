import { AbstractType } from "../type";
import { AppServiceInfo, AppServiceLifetime } from "./appServiceInfo";
import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";

/**
 * Marks a class as being contract for transient application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {AbstractType} [contractType] Indicates the contract type, if different from the decorated type.
 * @param {*} [contractToken] Indicates the contract token, if different from the contract type.
 */
export function AppServiceContract(
    {
        allowMultiple = false,
        contractType,
        contractToken,
        registry,
        ...args
    }: {
        allowMultiple?: boolean;
        contractType?: AbstractType;
        contractToken?: any;
        registry?: AppServiceInfoRegistry;
        [key: string]: any;
    } = {}) {
    return (type: AbstractType) => {
        contractType = contractType ? contractType : type;
        contractToken = contractToken ? contractToken : contractType;
        const appServiceInfo = new AppServiceInfo({ contractType, contractToken, allowMultiple, lifetime: AppServiceLifetime.Transient, ...args });
        (registry || AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}

/**
 * Marks a class as being contract for singleton application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {AbstractType} [contractType] Indicates the contract type, if different from the decorated type.
 * @param {*} [contractToken] Indicates the contract token, if different from the contract type.
 */
export function SingletonAppServiceContract(
    {
        allowMultiple = false,
        contractType,
        contractToken,
        registry,
        ...args
    }: {
        allowMultiple?: boolean;
        contractType?: AbstractType;
        contractToken?: any;
        registry?: AppServiceInfoRegistry;
        [key: string]: any;
    } = {}) {
    return (type: AbstractType) => {
        contractType = contractType ? contractType : type;
        contractToken = contractToken ? contractToken : contractType;
        const appServiceInfo = new AppServiceInfo({ contractType, contractToken, allowMultiple, lifetime: AppServiceLifetime.Singleton, ...args });
        (registry || AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}
