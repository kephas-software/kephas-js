import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { MessageProcessorClient, ResponseMessage } from '@kephas/messaging';
import { Expando, Type } from '@kephas/core';

export interface MessageState<TMessage> extends Expando {
  message?: TMessage;
}

/**
 * Observable based on a message query.
 *
 * @export
 * @abstract
 * @class MessageQuery
 * @extends {BehaviorSubject<TValue>}
 * @template TMessage
 * @template TResponseMessage
 * @template TValue
 */
export abstract class MessageQuery<TMessage, TResponseMessage extends ResponseMessage, TValue> extends BehaviorSubject<TValue> {
  static #execId = 0;
  static #pendingExecs: Expando = {};

  #loading = false;
  #lastError: any;

  /**
   * Creates an instance of MessageQuery.
   * @param {MessageProcessorClient} processor
   * @param {(r: TResponseMessage, state?: MessageState<TMessage>) => TValue} [resultMap]
   * @param {(m: TMessage, state?: MessageState<TMessage>) => TMessage} [messageMap]
   * @param {TValue} [emptyResult={} as TValue]
   * @memberof MessageQuery
   */
  constructor(
    protected readonly processor: MessageProcessorClient,
    protected resultMap?: (r: TResponseMessage, state?: MessageState<TMessage>) => TValue,
    protected messageMap?: (m: TMessage, state?: MessageState<TMessage>) => TMessage,
    protected emptyResult: TValue = {} as TValue) {
    super(null!);
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

  public execute(state?: MessageState<TMessage>): void {
    const execId = (MessageQuery.#execId++).toString();
    MessageQuery.#pendingExecs[execId] = this.fetch(state?.message, state)
      .pipe(
        tap(x => super.next(x)),
        finalize(() => delete MessageQuery.#pendingExecs[execId]));
  }

  protected fetch(message: any, state?: MessageState<TMessage>): Observable<TValue> {
    this.#loading = true;

    message = this.mapMessage(message, state);

    return this.processor
      .process(message)
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

  protected mapResponse(response: TResponseMessage, state?: MessageState<TMessage>): TValue {
    return this.resultMap ? this.resultMap(response, state) : response as unknown as TValue;
  }

  protected mapMessage(message: TMessage, state?: MessageState<TMessage>): TMessage {
    return this.messageMap ? this.messageMap(message, state) : message;
  }
}
