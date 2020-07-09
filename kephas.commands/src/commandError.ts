import { CommandResponse } from '.';

/**
 * Signals that a command error occurred.
 *
 * @export
 * @class CommandError
 * @extends {Error}
 */
export class CommandError extends Error {
    /**
     * Creates an instance of CommandError.
     * @param {string} message The error message.
     * @param {CommandResponse} [response] Optional. The command response.
     * @memberof CommandError
     */
    constructor(message: string, public readonly response?: CommandResponse) {
        super(message);
    }
}
