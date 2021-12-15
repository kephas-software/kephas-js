/**
 * Signals an injection error.
 *
 * @export
 * @class InjectionError
 * @extends {Error}
 */
export class InjectionError extends Error {
    /**
     * Creates an instance of InjectionError.
     * @param {string} message The error message.
     * @memberof InjectionError
     */
    constructor(message: string) {
        super(message);
    }
}
