import { Context } from '@kephas/core';

/**
 * Options for client message processing.
 *
 * @export
 * @class MessagingClientContext
 * @extends {Context}
 */
export class MessagingClientContext extends Context {
    /**
     * Indicates whether warnings should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof MessageOptions
     */
    notifyWarnings?: boolean;

    /**
     * Indicates whether errors should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof MessageOptions
     */
    notifyErrors?: boolean;

    /**
     * Indicates the number of retries if the operation fails. Default is none.
     *
     * @type {number}
     * @memberof MessageOptions
     */
    retries?: number;
}