import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";

/**
 * Marks a class as being an application service. Its closest base registered as service contract is
 * considered to be its contract.
 *
 * @export
 */
export function AppService() {
    return (ctor: Function) => {
        AppServiceInfoRegistry.Instance.registerServiceType(ctor);
    };
}