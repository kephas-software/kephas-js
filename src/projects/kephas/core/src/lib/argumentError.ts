/**
 * Signals that an argument is not valid.
 *
 * @export
 * @class ArgumentError
 * @extends {Error}
 */
export class ArgumentError extends Error {
    /**
     * Creates an instance of ArgumentError.
     * @param {string} message The error message.
     * @param {string} argName The argument name.
     * @memberof ArgumentError
     */
    constructor(message: string, public argName: string) {
        super(message);
    }
}