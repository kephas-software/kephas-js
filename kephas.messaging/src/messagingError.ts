import { LogLevel } from '@kephas/core';

/**
 * The error information.
 *
 * @export
 * @interface ErrorInfo
 */
export interface ErrorInfo {
    /**
     * The error severity.
     *
     * @type {LogLevel}
     * @memberof ErrorInfo
     */
    severity: LogLevel;

    /**
     * The error message.
     *
     * @type {string}
     * @memberof ErrorInfo
     */
    message?: string;

    [key: string]: any;
}

/**
 * Signals that a messaging error occurred.
 *
 * @export
 * @class MessageError
 * @extends {Error}
 */
export class MessagingError extends Error {
    /**
     * Creates an instance of MessageError.
     * @param {string} message The error message.
     * @param {ErrorInfo} [response] Optional. The extended error information.
     * @memberof MessageError
     */
    constructor(message: string, public readonly response?: ErrorInfo) {
        super(message);
    }
}
