/**
 * Signals that an operation is not supported.
 *
 * @export
 * @class NotSupportedError
 * @extends {Error}
 */
export class NotSupportedError extends Error {
    /**
     * Creates an instance of NotSupportedError.
     * @param {string} message The error message.
     * @memberof ArgumentError
     */
    constructor(message: string) {
        super(message);
    }
}