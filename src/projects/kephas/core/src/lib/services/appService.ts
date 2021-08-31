import { CompositionContext } from "../composition/compositionContext";
import { Type } from "../type";
import { AppServiceInfoRegistry } from "./appServiceInfoRegistry";
import { AppServiceMetadata, Priority } from "./composition/appServiceMetadata";

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
        provider,
        registry
    }: {
        overridePriority?: number | Priority;
        processingPriority?: number | Priority;
        serviceName?: string;
        provider?: ((c: CompositionContext) => any) | {};
        registry?: AppServiceInfoRegistry;
    } = {}) {
    return (type: Type<any>) => {
        (registry || AppServiceInfoRegistry.Instance).registerService(
            type,
            new AppServiceMetadata<any>({
                overridePriority,
                processingPriority,
                serviceName,
                serviceType: type,
                serviceInstance: typeof provider === 'object'
                                    ? provider
                                    : undefined,
                serviceFactory: typeof provider === 'function'
                                    ? provider as ((c: CompositionContext) => any)
                                    : undefined,
            }));
    };
}
