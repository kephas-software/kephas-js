import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
    LogLevel, AppService,
    Priority, Logger, Expando
} from '@kephas/core';
import {
    CommandProcessorClient, CommandClientContext, CommandResponse, CommandError
} from '@kephas/commands';
import { NotificationService } from '@kephas/ui';
import { Observable, ObservableInput } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';
import { AppSettings } from './appSettings';

/**
 * Provides proxied command execution over HTTP.
 *
 * @export
 * @class HttpCommandProcessorClient
 */
@AppService({ overridePriority: Priority.Low })
export class HttpCommandProcessorClient extends CommandProcessorClient {

    /**
     * Gets or sets the base route for the command execution.
     *
     * @protected
     * @type {string}
     * @memberof CommandProcessor
     */
    protected baseRoute = 'api/cmd/';

    /**
     * Initializes a new instance of the CommandProcessor class.
     * @param {NotificationService} notification The notification service.
     * @param {HttpClient} http The HTTP client.
     * @param {AppSettings} appSettings The application settings.
     */
    constructor(
        protected appSettings: AppSettings,
        protected http: HttpClient,
        protected notification: NotificationService,
        protected logger: Logger) {
        super();
    }

    /**
     * Processes the command asynchronously.
     * @tparam T The command response type.
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandClientContext} [options] Optional. Options controlling the command processing.
     * @returns {Observable{T}} An observable over the result.
     */
    public process<T extends CommandResponse>(command: string, args?: {}, options?: CommandClientContext): Observable<T> {
        const url = this.getHttpGetUrl(command, args, options);
        let obs = this.http.get<T>(url, this.getHttpGetOptions(command, args, options));
        if (options && options.retries) {
            obs = obs.pipe(
                retry(options.retries),
                map(response => this._processResponse(response, options)),
                catchError(error => this._processError<T>(error, options)));
        }
        else {
            obs = obs.pipe(
                map(response => this._processResponse(response, options)),
                catchError(error => this._processError<T>(error, options)));
        }

        return obs;
    }

    /**
     * Gets the HTTP GET URL.
     *
     * @protected
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandClientContext} [options] Optional. Options controlling the command processing.
     * @returns {string} The HTTP GET URL.
     * @memberof CommandProcessor
     */
    protected getHttpGetUrl(command: string, args?: {}, options?: CommandClientContext): string {
        let baseUrl = this.appSettings.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        let url = `${baseUrl}${this.baseRoute}${command}/`;
        if (args) {
            url = url + '?' + Object.keys(args)
                .map(key => `${key}=${(args as Expando)[key]}`)
                .join('&');
        }

        return url;
    }

    /**
     * Gets the HTTP GET options. By default it does not return any options.
     *
     * @protected
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandClientContext} [options] Optional. Options controlling the command processing.
     * @returns {({
     *             headers?: HttpHeaders | {
     *                 [header: string]: string | string[];
     *             };
     *             observe?: 'body';
     *             params?: HttpParams | {
     *                 [param: string]: string | string[];
     *             };
     *             reportProgress?: boolean;
     *             responseType?: 'json';
     *             withCredentials?: boolean;
     *         } | undefined)} The options or undefined.
     * @memberof CommandProcessor
     */
    protected getHttpGetOptions(command: string, args?: {}, options?: CommandClientContext): {
        headers?: HttpHeaders | {
            [header: string]: string | string[];
        };
        observe?: 'body';
        params?: HttpParams | {
            [param: string]: string | string[];
        };
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } | undefined {
        return undefined;
    }

    private _processResponse<T extends CommandResponse>(response: T, options?: CommandClientContext): T {
        if (typeof response.severity === 'string') {
            response.severity = (LogLevel as Expando)[response.severity as string];
        }

        if (response.severity <= LogLevel.Error) {
            throw new CommandError(response.message!, response);
        }

        if (response.severity === LogLevel.Warning) {
            this.logger.log(response.severity, null, response.message!);
            if (!(options && (options.notifyWarnings === undefined || options.notifyWarnings))) {
                this.notification.notifyWarning(response);
            }
        }

        if (response.severity <= LogLevel.Error) {
            throw new Error(response.message);
        }
        return response;
    }

    private _processError<T extends CommandResponse>(error: any, options?: CommandClientContext): ObservableInput<T> {
        this.logger.error(error);
        if (!(options && (options.notifyErrors === undefined || options.notifyErrors))) {
            this.notification.notifyError(error);
        }

        throw error;
    }
}
