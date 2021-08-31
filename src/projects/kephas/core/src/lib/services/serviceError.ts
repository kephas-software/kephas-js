/**
 * Signals an error with respect to a service or its registration.
 *
 * @export
 * @class ServiceError
 * @extends {Error}
 */
export class ServiceError extends Error {
    /**
     * Creates an instance of ServiceError.
     * @param {string} message The error message.
     * @memberof ServiceError
     */
    constructor(message: string) {
        super(message);
    }
}