/**
 * Signals that an operation does not have a proper implementation.
 *
 * @export
 * @class NotImplementedError
 * @extends {Error}
 */
export class NotImplementedError extends Error {
    /**
     * Creates an instance of NotImplementedError.
     * @param {string} message The error message.
     * @memberof ArgumentError
     */
    constructor(message: string) {
        super(message);
    }
}