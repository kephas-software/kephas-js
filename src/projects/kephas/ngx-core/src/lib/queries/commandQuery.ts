import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { CommandProcessorClient } from '@kephas/commands';
import { Expando } from '@kephas/core';

export interface CommandState<TArgs> extends Expando {
  command?: string;
  args?: TArgs;
}

export abstract class CommandQuery<TArgs, TResponseMessage, TValue> extends BehaviorSubject<TValue> {
  public loading: boolean = false;
  public args?: TArgs;

  constructor(
    protected readonly processor: CommandProcessorClient,
    protected command: string,
    protected resultMap?: (r: TResponseMessage, state?: CommandState<TArgs>) => TValue,
    protected argsMap?: (args?: TArgs, state?: CommandState<TArgs>) => TArgs,
    protected emptyResult: TValue = {} as TValue) {
    super(null!);
    this.args ??= {} as TArgs;
  }

  public execute(state?: CommandState<TArgs>): void {
    this.fetch(state?.command ?? this.command, state?.args ?? this.args!, state)
      .pipe(tap(x => super.next(x)));
  }

  protected fetch(command: string, args?: TArgs, state?: CommandState<TArgs>): Observable<TValue> {
    this.loading = true;

    args = this.mapArgs(args, state);

    return this.processor
      .process(command, args!)
      .pipe(
        map(response => this.mapResponse(response as unknown as TResponseMessage, state)),
        finalize(() => this.loading = false),
        catchError(_ => {
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
