import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";
import { AppServiceMetadata } from "./composition/appServiceMetadata";

/**
 * Marks a class as being an application service. Its closest base registered as service contract is
 * considered to be its contract.
 *
 * @export
 * @param {number} [overridePriority=0] Optional. The override priority.
 * @param {number} [processingPriority=0] Optional. The processing priority.
 * @param {string} [serviceName] Optional. The service name.
 * @returns A function.
 */
export function AppService(overridePriority: number = 0, processingPriority: number = 0, serviceName?: string) {
    return (ctor: Function) => {
        AppServiceInfoRegistry.Instance.registerServiceType(ctor, new AppServiceMetadata({ overridePriority, processingPriority, serviceName, implementationType: ctor }));
    };
}