import { Context } from '@kephas/core';

/**
 * Options for controlling the command execution.
 *
 * @export
 * @interface CommandClientContext
 */
export interface CommandClientContext extends Context {
    /**
     * Indicates whether warnings should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof CommandClientContext
     */
    notifyWarnings?: boolean;

    /**
     * Indicates whether errors should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof CommandClientContext
     */
    notifyErrors?: boolean;

    /**
     * Indicates the number of retries if the operation fails. Default is none.
     *
     * @type {number}
     * @memberof CommandClientContext
     */
    retries?: number;
}