import { SingletonAppServiceContract, Type, AbstractType } from '..';

/**
 * Contract for composition context.
 *
 * @export
 * @abstract
 * @class CompositionContext
 */
@SingletonAppServiceContract()
export abstract class CompositionContext {
    /**
     * Gets the service instance of the required service contract type.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T} The requested service.
     * @memberof ICompositionContext
     */
    abstract get<T>(type: Type<T> | AbstractType): T;

    /**
     * Gets an array of service instances.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T[]} The array of the requested service.
     * @memberof ICompositionContext
     */
    abstract getMultiple<T>(type: Type<T> | AbstractType): T[];
}