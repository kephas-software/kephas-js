// tslint:disable: max-classes-per-file

import { Disposable } from "../disposable";
import { Logger } from "../logging/logger";
import { AppService } from "../services/appService";
import { SingletonAppServiceContract } from "../services/appServiceContract";
import { Priority } from "../services/appServiceMetadata";
import { Context } from "../services/context";
import { AbstractType, Type } from "../type";

class EventSubscription implements Disposable {
    constructor(
        public match: (event: any) => boolean,
        public callback: (event: any, context: Context | undefined) => Promise<any> | void,
        private _onDispose: (subscription: EventSubscription) => void) {
    }

    dispose(): void {
        this._onDispose(this);
    }
}

/**
 * Singleton application service handling in-process event publishing/subscribing.
 *
 * @export
 * @class EventHub
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class EventHub {

    private _subscriptions: EventSubscription[] = [];
    private _logger: Logger;

    /**
     * Creates an instance of EventHub.
     *
     * @param {Logger} logger The logger.
     * @memberof EventHub
     */
    constructor(logger?: Logger) {
        this._logger = logger || new Logger();
    }

    /**
     * Gets the logger.
     *
     * @readonly
     * @protected
     * @type {Logger}
     * @memberof EventHub
     */
    protected get logger(): Logger {
        return this._logger;
    }

    /**
     * Publishes the event asynchronously to its subscribers.
     *
     * @param {*} event The event.
     * @param {Context} [context] Optional. The context.
     * @returns {Promise<any>} The promise.
     * @memberof EventHub
     */
    async publishAsync(event: any, context?: Context): Promise<any> {
        const subscriptions = this._subscriptions.filter(s => s.match(event));
        for (const subscription of subscriptions) {
            try {
                const promise = subscription.callback(event, context);
                if (promise) {
                    await promise;
                }
            }
            catch (err) {
                this.logger.error(err as Error);
            }
        }
    }

    /**
     * Subscribes to the event(s) matching the criteria.
     *
     * @template T The event type.
     * @param {(AbstractType | Type<T>)} match Specifies the match type.
     * @param {((event: T, context?: Context) => Promise<any> | void)} callback The callback.
     * @returns {Disposable} A disposable event subscription.
     * @memberof EventHub
     */
    subscribe<T>(match: AbstractType | Type<T>, callback: (event: T, context?: Context) => Promise<any> | void): Disposable {
        const subscription = new EventSubscription(
            this._getMatch(match),
            callback,
            s => {
                const i = this._subscriptions.indexOf(s);
                this._subscriptions.splice(i, 1);
            }
        )

        this._subscriptions.push(subscription);
        return subscription;
    }

    private _getMatch<T>(match: AbstractType | Type<T>): ((event: any) => boolean) {
        return event => event instanceof match;
    }
}
