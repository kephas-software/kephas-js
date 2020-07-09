import { SingletonAppServiceContract, AppService, Priority, NotImplementedError } from '@kephas/core';
import { ResponseMessage, MessagingClientContext } from '.';
import { Observable } from 'rxjs';

/**
 * Provides message processing.
 *
 * @export
 * @class MessageProcessor
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class MessageProcessorClient {
    /**
     * Processes the message asynchronously.
     * @tparam T The message response type.
     * @param {{}} message The message.
     * @param {MessageOptions} [options] Optional. Options controlling the command processing.
     * @returns {Promise{T}} A promise of the result.
     */
    public process<T extends ResponseMessage>(message: object, options?: MessagingClientContext): Observable<T> {
        throw new NotImplementedError('Please provide a proper implementation of the MessageProcessorClient service.');
    }
}