/**
 * Signals a composition error.
 *
 * @export
 * @class CompositionError
 * @extends {Error}
 */
export class CompositionError extends Error {
    /**
     * Creates an instance of CompositionError.
     * @param {string} message The error message.
     * @memberof CompositionError
     */
    constructor(message: string) {
        super(message);
    }
}