import { Context } from '..';

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
    initialize(context?: Context): void;
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
    initializeAsync(context?: Context): Promise<void>;
}