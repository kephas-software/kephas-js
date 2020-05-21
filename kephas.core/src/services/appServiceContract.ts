import { AppServiceInfo, AppServiceLifetime } from "./appServiceInfo";
import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";
import { Type } from "../type";

/**
 * Marks a class as being contract for transient application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {Type<any>} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function AppServiceContract(
    {
        allowMultiple = false,
        contractType,
        registry
    }: {
        allowMultiple?: boolean;
        contractType?: Type<any>;
        registry?: AppServiceInfoRegistry;
    } = {}) {
    return (type: Type<any>) => {
        const appServiceInfo = new AppServiceInfo({ contractType: contractType ?? type, allowMultiple, lifetime: AppServiceLifetime.Transient });
        (registry ?? AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}

/**
 * Marks a class as being contract for singleton application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {Type<any>} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function SingletonAppServiceContract(
    {
        allowMultiple = false,
        contractType,
        registry
    }: {
        allowMultiple?: boolean;
        contractType?: Type<any>;
        registry?: AppServiceInfoRegistry;
    } = {}) {
    return (type: Type<any>) => {
        const appServiceInfo = new AppServiceInfo({ contractType: contractType ?? type, allowMultiple, lifetime: AppServiceLifetime.Singleton });
        (registry ?? AppServiceInfoRegistry.Instance).registerServiceContract(type, appServiceInfo);
    };
}