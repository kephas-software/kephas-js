import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { CommandProcessorClient } from '@kephas/commands';
import { Expando } from '@kephas/core';

export interface CommandState<TArgs> extends Expando {
  command?: string;
  args?: TArgs;
}

/**
 * Observable based on a command query.
 *
 * @export
 * @abstract
 * @class CommandQuery
 * @extends {BehaviorSubject<TValue>}
 * @template TArgs
 * @template TResponseMessage
 * @template TValue
 */
export abstract class CommandQuery<TArgs, TResponseMessage, TValue> extends BehaviorSubject<TValue> {
  #loading = false;
  #lastError: any;

  public args?: TArgs;

  /**
   * Creates an instance of CommandQuery.
   * @param {CommandProcessorClient} processor
   * @param {string} command
   * @param {(r: TResponseMessage, state?: CommandState<TArgs>) => TValue} [resultMap]
   * @param {(args?: TArgs, state?: CommandState<TArgs>) => TArgs} [argsMap]
   * @param {TValue} [emptyResult={} as TValue]
   * @memberof CommandQuery
   */
  constructor(
    protected readonly processor: CommandProcessorClient,
    protected command: string,
    protected resultMap?: (r: TResponseMessage, state?: CommandState<TArgs>) => TValue,
    protected argsMap?: (args?: TArgs, state?: CommandState<TArgs>) => TArgs,
    protected emptyResult: TValue = {} as TValue) {
    super(null!);
    this.args ??= {} as TArgs;
  }

  /**
   * Gets a value indicating whether the query is executing.
   *
   * @readonly
   * @type {boolean}
   * @memberof CommandQuery
   */
  get loading(): boolean {
    return this.#loading;
  }

  /**
   * Gets the last error executing this query.
   *
   * @readonly
   * @type {*}
   * @memberof CommandQuery
   */
  get lastError(): any {
    return this.#lastError;
  }

  /**
   * Executes the command asynchronously.
   *
   * @param {CommandState<TArgs>} [state]
   * @memberof CommandQuery
   */
  public execute(state?: CommandState<TArgs>): void {
    // no need to unsubscribe, as this is an auto-complete observable.
    this.fetch(state?.command ?? this.command, state?.args ?? this.args!, state)
      .subscribe(x => super.next(x));
  }

  protected fetch(command: string, args?: TArgs, state?: CommandState<TArgs>): Observable<TValue> {
    this.#loading = true;

    args = this.mapArgs(args, state);

    return this.processor
      .process(command, args!)
      .pipe(
        map(response => {
          this.#lastError = undefined;
          return this.mapResponse(response as unknown as TResponseMessage, state);
        }),
        finalize(() => this.#loading = false),
        catchError(err => {
          this.#lastError = err;
          return of(this.emptyResult);
        })
      );
  }

  protected mapResponse(response: TResponseMessage, state?: CommandState<TArgs>): TValue {
    return this.resultMap ? this.resultMap(response, state) : response as unknown as TValue;
  }

  protected mapArgs(args?: TArgs, state?: CommandState<TArgs>): TArgs | undefined {
    return this.argsMap ? this.argsMap(args, state) : args;
  }
}
