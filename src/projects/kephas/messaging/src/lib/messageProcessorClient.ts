import { SingletonAppServiceContract, AppService, Priority, NotImplementedError } from '@kephas/core';
import { Observable } from 'rxjs';
import { ResponseMessage } from './message';
import { MessagingClientContext } from './messagingClientContext';

/**
 * Provides proxied message processing.
 *
 * @export
 * @class MessageProcessor
 */
@AppService({ overridePriority: Priority.Lowest })
@SingletonAppServiceContract()
export class MessageProcessorClient {
    /**
     * Processes the message asynchronously.
     * @tparam T The message response type.
     * @param {{}} message The message.
     * @param {MessagingClientContext} [options] Optional. Options controlling the message processing.
     * @returns {Observable{T}} An observable over the result.
     */
    public process<T extends ResponseMessage>(message: object, options?: MessagingClientContext): Observable<T> {
        throw new NotImplementedError('Please provide a proper implementation of the MessageProcessorClient service.');
    }
}
