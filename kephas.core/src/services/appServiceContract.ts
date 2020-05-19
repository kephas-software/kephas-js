import { AppServiceInfo, AppServiceLifetime } from "./appServiceInfo";
import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";

/**
 * Marks a class as being contract for transient application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {Function} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function AppServiceContract(allowMultiple: boolean = false, contractType?: Function) {
    return (ctor: Function) => {
        const appServiceInfo = new AppServiceInfo(contractType ?? ctor, allowMultiple, AppServiceLifetime.Transient);
        AppServiceInfoRegistry.Instance.registerServiceContract(ctor, appServiceInfo);
    };
}

/**
 * Marks a class as being contract for singleton application services.
 *
 * @export
 * @param {boolean} [allowMultiple=false] Indicates whether multiple services may be registered with the same contract or not.
 * @param {Function} [contractType] Indicates the contract type, if different from the decorated type.
 */
export function SingletonAppServiceContract(allowMultiple: boolean = false, contractType?: Function) {
    return (ctor: Function) => {
        const appServiceInfo = new AppServiceInfo(contractType ?? ctor, allowMultiple, AppServiceLifetime.Singleton);
        AppServiceInfoRegistry.Instance.registerServiceContract(ctor, appServiceInfo);
    };
}