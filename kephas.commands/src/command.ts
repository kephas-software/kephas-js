import { LogLevel, Expando } from '@kephas/core';

/**
 * The base command response.
 *
 * @export
 * @interface CommandResponse
 */
export interface CommandResponse extends Expando {
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
}
