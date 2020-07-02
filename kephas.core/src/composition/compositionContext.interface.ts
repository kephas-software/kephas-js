import { Type } from "..";


/**
 * Interface for a composition context.
 *
 * @export
 * @interface ICompositionContext
 */
export interface ICompositionContext {
    /**
     * Gets the service instance of the required service contract type.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T} The requested service.
     * @memberof ICompositionContext
     */
    get<T>(type: Type<T>): T;

    /**
     * Gets an array of service instances.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @returns {T[]} The array of the requested service.
     * @memberof ICompositionContext
     */
    getMultiple<T>(type: Type<T>): T[];
}