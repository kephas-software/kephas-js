import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LogLevel, AppService, SingletonAppServiceContract, Priority, Logger } from "@kephas/core";
import { Notification } from "@kephas/ui";
import { AppSettings } from "..";
import { Observable, ObservableInput } from "rxjs";
import { retry, map, catchError } from "rxjs/operators";

/**
 * The base command response.
 *
 * @export
 * @interface CommandResponse
 */
export interface CommandResponse {
    /**
     * The severity.
     *
     * @type {LogLevel}
     * @memberof CommandResponse
     */
    severity: LogLevel;

    /**
     * The message.
     *
     * @type {string}
     * @memberof CommandResponse
     */
    message?: string;

    [key: string]: any;
}

/**
 * Signals that a command error occurred.
 *
 * @export
 * @class CommandError
 * @extends {Error}
 */
export class CommandError extends Error {
    /**
     * Creates an instance of CommandError.
     * @param {string} message The error message.
     * @param {CommandResponse} [response] Optional. The command response.
     * @memberof CommandError
     */
    constructor(message: string, public readonly response?: CommandResponse) {
        super(message);
    }
}

/**
 * Options for controlling the command execution.
 *
 * @export
 * @interface CommandOptions
 */
export interface CommandOptions {
    /**
     * Indicates whether warnings should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof CommandOptions
     */
    notifyWarnings?: boolean;

    /**
     * Indicates whether errors should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof CommandOptions
     */
    notifyErrors?: boolean;

    /**
     * Indicates the number of retries if the operation fails. Default is none.
     *
     * @type {number}
     * @memberof CommandOptions
     */
    retries?: number;
}

/**
 * Provides command execution.
 *
 * @export
 * @class CommandProcessor
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class CommandProcessor {

    /**
     * Gets or sets the base route for the command execution.
     *
     * @protected
     * @type {string}
     * @memberof CommandProcessor
     */
    protected baseRoute: string = "api/cmd/";

    /**
   * Initializes a new instance of the CommandProcessor class.
   * @param {Notification} notification The notification service.
   * @param {HttpClient} http The HTTP client.
   * @param {AppSettings} appSettings The application settings.
   */
    constructor(
        protected appSettings: AppSettings,
        protected http: HttpClient,
        protected notification: Notification,
        protected logger: Logger) {
    }

    /**
     * Processes the command asynchronously.
     * @tparam T The message response type.
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandOptions} [options] Optional. Options controlling the command processing.
     * @returns {Promise{T}} A promise of the result.
     */
    public process<T extends CommandResponse>(command: string, args?: {}, options?: CommandOptions): Observable<T> {
        let url = this.getHttpGetUrl(command, args, options);
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
     * @param {CommandOptions} [options] Optional. Options controlling the command processing.
     * @returns {string} The HTTP GET URL.
     * @memberof CommandProcessor
     */
    protected getHttpGetUrl(command: string, args?: {}, options?: CommandOptions): string {
        let baseUrl = this.appSettings.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        let url = `${baseUrl}${this.baseRoute}${command}/`;
        if (args) {
            url = url + '?' + Object.keys(args)
                .map(key => `${key}=${args[key]}`)
                .join("&");
        }

        return url;
    }

    /**
     * Gets the HTTP GET options. By default it does not return any options.
     *
     * @protected
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {CommandOptions} [options] Optional. Options controlling the command processing.
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
    protected getHttpGetOptions(command: string, args?: {}, options?: CommandOptions): {
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

    private _processResponse<T extends CommandResponse>(response: T, options?: CommandOptions): T {
        if (typeof response.severity === "string") {
            response.severity = LogLevel[response.severity as string];
        }

        if (response.severity <= LogLevel.Error) {
            throw new CommandError(response.message!, response);
        }

        if (response.severity == LogLevel.Warning) {
            this.logger.log(response.severity, null, response.message!);
            if (!(options && (options.notifyWarnings == undefined || options.notifyWarnings))) {
                this.notification.notifyWarning(response);
            }
        }

        if (response.severity <= LogLevel.Error) {
            throw new Error(response.message);
        }
        return response;
    }

    private _processError<T extends CommandResponse>(error: any, options?: CommandOptions): ObservableInput<T> {
        this.logger.error(error);
        if (!(options && (options.notifyErrors == undefined || options.notifyErrors))) {
            this.notification.notifyError(error);
        }

        throw error;
    }
}
