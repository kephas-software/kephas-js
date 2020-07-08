import { LogLevel } from '@kephas/core';

/**
 * The base command response.
 *
 * @export
 * @interface CommandResponse
 */
export interface CommandResponse {
    /**
     * The severity.
     *
     * @type {LogLevel}
     * @memberof CommandResponse
     */
    severity: LogLevel;

    /**
     * The message.
     *
     * @type {string}
     * @memberof CommandResponse
     */
    message?: string;

    [key: string]: any;
}

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
