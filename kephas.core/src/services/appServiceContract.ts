import { AppServiceInfo, AppServiceLifetime } from "..";
import { AppServiceInfoRegistry } from "..";
import { AbstractType } from "..";

/**
 * Marks a class as being contract for transient application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {AbstractType} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function AppServiceContract(
    {
        allowMultiple = false,
        contractType,
        registry,
        ...args
    }: {
        allowMultiple?: boolean;
        contractType?: AbstractType;
        registry?: AppServiceInfoRegistry;
        [key: string]: any;
    } = {}) {
    return (type: AbstractType) => {
        const appServiceInfo = new AppServiceInfo({ contractType: contractType ? contractType : type, allowMultiple, lifetime: AppServiceLifetime.Transient, ...args });
        (registry ? registry : AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}

/**
 * Marks a class as being contract for singleton application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {AbstractType} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function SingletonAppServiceContract(
    {
        allowMultiple = false,
        contractType,
        registry,
        ...args
    }: {
        allowMultiple?: boolean;
        contractType?: AbstractType;
        registry?: AppServiceInfoRegistry;
        [key: string]: any;
    } = {}) {
    return (type: AbstractType) => {
        const appServiceInfo = new AppServiceInfo({ contractType: contractType ? contractType : type, allowMultiple, lifetime: AppServiceLifetime.Singleton, ...args });
        (registry ? registry : AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}