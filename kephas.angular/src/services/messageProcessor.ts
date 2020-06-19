import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { LogLevel, AppService, SingletonAppServiceContract, Priority, Logger } from "@kephas/core";
import { Notification } from "@kephas/ui";
import { AppSettings } from "..";
import { Observable, ObservableInput } from "rxjs";
import { retry, map, catchError } from "rxjs/operators";

/**
 * The base message response.
 *
 * @export
 * @interface MessageResponse
 */
export interface MessageResponse {
    /**
     * The severity.
     *
     * @type {LogLevel}
     * @memberof MessageResponse
     */
    severity: LogLevel;

    /**
     * The message.
     *
     * @type {string}
     * @memberof MessageResponse
     */
    message?: string;

    [key: string]: any;
}

/**
 * Signals that a message error occurred.
 *
 * @export
 * @class MessageError
 * @extends {Error}
 */
export class MessageError extends Error {
    /**
     * Creates an instance of MessageError.
     * @param {string} message The error message.
     * @param {MessageResponse} [response] Optional. The message response.
     * @memberof MessageError
     */
    constructor(message: string, public readonly response?: MessageResponse) {
        super(message);
    }
}

/**
 * Options for controlling the message processing.
 *
 * @export
 * @interface MessageOptions
 */
export interface MessageOptions {
    /**
     * Indicates whether warnings should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof MessageOptions
     */
    notifyWarnings?: boolean;

    /**
     * Indicates whether errors should be notified. Default is true.
     *
     * @type {boolean}
     * @memberof MessageOptions
     */
    notifyErrors?: boolean;

    /**
     * Indicates the number of retries if the operation fails. Default is none.
     *
     * @type {number}
     * @memberof MessageOptions
     */
    retries?: number;
}

/**
 * Provides message processing.
 *
 * @export
 * @class MessageProcessor
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class MessageProcessor {

    /**
     * Gets or sets the base route for the command execution.
     *
     * @protected
     * @type {string}
     * @memberof MessageProcessor
     */
    protected baseRoute: string = "api/msg/";

    /**
   * Initializes a new instance of the MessageProcessor class.
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
     * Processes the message asynchronously.
     * @tparam T The message response type.
     * @param {{}} message The message.
     * @param {MessageOptions} [options] Optional. Options controlling the command processing.
     * @returns {Promise{T}} A promise of the result.
     */
    public process<T extends MessageResponse>(message: {}, options?: MessageOptions): Observable<T> {
        let url = this.getHttpPostUrl(message, options);
        let obs = this.http.post<T>(url, message, this.getHttpPostOptions(message, options));
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
     * @param {{}} message The message.
     * @param {MessageOptions} [options] Optional. Options controlling the command processing.
     * @returns {string} The HTTP GET URL.
     * @memberof MessageProcessor
     */
    protected getHttpPostUrl(message: {}, options?: MessageOptions): string {
        let baseUrl = this.appSettings.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        let url = `${baseUrl}${this.baseRoute}`;
        return url;
    }

    /**
     * Gets the HTTP GET options. By default it does not return any options.
     *
     * @protected
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {MessageOptions} [options] Optional. Options controlling the command processing.
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
     * @memberof MessageProcessor
     */
    protected getHttpPostOptions(message: {}, options?: MessageOptions): {
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

    private _processResponse<T extends MessageResponse>(response: T, options?: MessageOptions): T {
        if (typeof response.severity === "string") {
            response.severity = LogLevel[response.severity as string];
        }

        if (response.severity <= LogLevel.Error) {
            throw new MessageError(response.message!, response);
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

    private _processError<T extends MessageResponse>(error: any, options?: MessageOptions): ObservableInput<T> {
        this.logger.error(error);
        if (!(options && (options.notifyErrors == undefined || options.notifyErrors))) {
            this.notification.notifyError(error);
        }

        throw error;
    }
}
