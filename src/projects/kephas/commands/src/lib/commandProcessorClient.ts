import { SingletonAppServiceContract, AppService, Priority, NotImplementedError } from '@kephas/core';
import { Observable } from 'rxjs';
import { CommandResponse } from './command';
import { CommandClientContext } from './commandClientContext';

/**
 * Provides proxied command execution.
 *
 * @export
 * @class CommandProcessorClient
 */
@AppService({ overridePriority: Priority.Lowest })
@SingletonAppServiceContract()
export class CommandProcessorClient {
    /**
     * Processes the command asynchronously.
     * @tparam T The command response type.
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandClientContext} [options] Optional. Options controlling the command processing.
     * @returns {Observable{T}} An observable of the result.
     */
    public process<T extends CommandResponse>(command: string, args?: {}, options?: CommandClientContext): Observable<T> {
        throw new NotImplementedError('Please provide a proper implementation of the CommandProcessorClient service.');
    }
}
