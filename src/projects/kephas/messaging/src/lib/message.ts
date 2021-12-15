import { Serializable, LogLevel, Expando } from '@kephas/core';

/**
 * Marker class for messages.
 *
 * @export
 * @class Message
 */
export abstract class Message extends Serializable {
}

/**
 * The base message response.
 *
 * @export
 * @interface ResponseMessage
 */
export interface ResponseMessage extends Expando {
    /**
     * The severity.
     *
     * @type {LogLevel}
     * @memberof ResponseMessage
     */
    severity?: LogLevel;

    /**
     * The message.
     *
     * @type {string}
     * @memberof ResponseMessage
     */
    message?: string;
}
