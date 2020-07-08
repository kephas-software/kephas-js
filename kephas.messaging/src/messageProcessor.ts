import { Priority, AppService, SingletonAppServiceContract, Requires } from '@kephas/core';
import { Message, MessagingError } from '.';

/**
 * The messaging processor.
 *
 * @export
 * @class MessageProcessor
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class MessageProcessor {
    /**
     * Processes the message and returns a promise of the response.
     *
     * @template TResponse The response type.
     * @param {IMessage} message The message to process.
     * @returns {Promise<TResponse>}
     * @memberof MessageProcessor
     */
    processAsync<TResponse>(message: Message): Promise<TResponse> {
        Requires.HasValue(message, 'message');

        throw new MessagingError('Not implemented');
    }
}