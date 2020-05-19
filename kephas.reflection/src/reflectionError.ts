/**
 * Signals a reflection error.
 *
 * @export
 * @class ReflectionError
 * @extends {Error}
 */
export class ReflectionError extends Error {
    /**
     * Creates an instance of ReflectionError.
     * @param {string} message The error message.
     * @memberof ReflectionError
     */
    constructor(message: string) {
        super(message);
    }
}