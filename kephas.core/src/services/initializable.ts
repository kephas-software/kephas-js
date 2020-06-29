import { Context } from "..";

/**
 * Provides the Initialize method for service initialization.
 *
 * @export
 * @interface Initializable
 */
export interface Initializable {
    /**
     * Initializes the service.
     *
     * @param {Context} [context] Contextual information.
     * @memberof Initializable
     */
    Initialize(context?: Context): void;
}

/**
 * Provides the InitializeAsync method for asynchronous service initialization.
 *
 * @export
 * @interface AsyncInitializable
 */
export interface AsyncInitializable {
    /**
     * Initializes the service asynchronously.
     *
     * @param {Context} [context] Contextual information.
     * @memberof Initializable
     */
    InitializeAsync(context?: Context): Promise<void>;
}