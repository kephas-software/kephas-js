import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { MessageProcessorClient, ResponseMessage } from '@kephas/messaging';
import { Expando, Type } from '@kephas/core';

export interface MessageState<TMessage> extends Expando {
  message?: TMessage;
}

export abstract class MessageQuery<TMessage, TResponseMessage extends ResponseMessage, TValue> extends BehaviorSubject<TValue> {
  public loading: boolean = false;

  constructor(
    protected readonly processor: MessageProcessorClient,
    protected resultMap?: (r: TResponseMessage, state?: MessageState<TMessage>) => TValue,
    protected messageMap?: (m: TMessage, state?: MessageState<TMessage>) => TMessage,
    protected emptyResult: TValue = {} as TValue) {
    super(null!);
  }

  public execute(state?: MessageState<TMessage>): void {
    this.fetch(state?.message, state)
      .pipe(tap(x => super.next(x)));
  }

  protected fetch(message: any, state?: MessageState<TMessage>): Observable<TValue> {
    this.loading = true;

    message = this.mapMessage(message, state);

    return this.processor
      .process(message)
      .pipe(
        map(response => this.mapResponse(response as TResponseMessage, state)),
        finalize(() => this.loading = false),
        catchError(_ => {
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
