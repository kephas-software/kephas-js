/**
 * Signals a messaging error.
 *
 * @export
 * @class MessagingError
 * @extends {Error}
 */
export class MessagingError extends Error {
    /**
     * Creates an instance of MessagingError.
     * @param {string} message The error message.
     * @memberof MessagingError
     */
    constructor(message: string) {
        super(message);
    }
}