import { AppServiceInfoRegistry } from "..";
import { AppServiceMetadata, Priority } from "..";
import { Type } from "..";

/**
 * Marks a class as being an application service. Its closest base registered as service contract is
 * considered to be its contract.
 *
 * @export
 * @param {number|Priority} [overridePriority=Priority.Normal] Optional. The override priority.
 * @param {number|Priority} [processingPriority=Priority.Normal] Optional. The processing priority.
 * @param {string} [serviceName] Optional. The service name.
 * @returns A function.
 */
export function AppService(
    {
        overridePriority = Priority.Normal,
        processingPriority = Priority.Normal,
        serviceName,
        registry
    }: {
        overridePriority?: number | Priority;
        processingPriority?: number | Priority;
        serviceName?: string;
        registry?: AppServiceInfoRegistry;
    } = {}) {
    return (type: Type<any>) => {
        (registry || AppServiceInfoRegistry.Instance).registerService(type, new AppServiceMetadata({ overridePriority, processingPriority, serviceName, serviceType: type }));
    };
}