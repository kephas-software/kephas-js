import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LogLevel, AppService, Priority, Logger, Expando } from '@kephas/core';
import { Notification } from '@kephas/ui';
import {
    ResponseMessage, ErrorInfo, MessageProcessorClient,
    MessagingClientContext, MessagingError
} from '@kephas/messaging';
import { AppSettings } from '../../public-api';
import { Observable, ObservableInput } from 'rxjs';
import { retry, map, catchError } from 'rxjs/operators';


interface RawResponseMessage<T extends ResponseMessage> {
    /**
     * The exception information.
     *
     * @type {ErrorInfo}
     * @memberof RawResponseMessage
     */
    exception: ErrorInfo;

    /**
     * The response message.
     *
     * @type {T}
     * @memberof RawResponseMessage
     */
    message: T;
}

/**
 * Provides proxied message processing over HTTP.
 *
 * @export
 * @class MessageProcessor
 */
@AppService({ overridePriority: Priority.Low })
export class HttpMessageProcessorClient extends MessageProcessorClient {

    /**
     * Gets or sets the base route for the command execution.
     *
     * @protected
     * @type {string}
     * @memberof MessageProcessor
     */
    protected baseRoute: string = 'api/msg/';

    /**
     * Initializes a new instance of the HttpMessageProcessor class.
     * @param {Notification} notification The notification service.
     * @param {HttpClient} http The HTTP client.
     * @param {AppSettings} appSettings The application settings.
     */
    constructor(
        protected appSettings: AppSettings,
        protected http: HttpClient,
        protected notification: Notification,
        protected logger: Logger) {
        super();
    }

    /**
     * Processes the message asynchronously.
     * @tparam T The message response type.
     * @param {{}} message The message.
     * @param {MessagingClientContext} [options] Optional. Options controlling the message processing.
     * @returns {Observable{T}} An observable over the result.
     */
    public process<T extends ResponseMessage>(message: {}, options?: MessagingClientContext): Observable<T> {
        const url = this.getHttpPostUrl(message, options);
        const obs = this.http.post<RawResponseMessage<T>>(url, message, this.getHttpPostOptions(message, options));
        const responseObj = (options && options.retries)
            ? obs.pipe(
                retry(options.retries),
                map(response => this._processResponse<T>(response, options)),
                catchError(error => this._processError<T>(error, options)))
            : obs.pipe(
                map(response => this._processResponse<T>(response, options)),
                catchError(error => this._processError<T>(error, options)));

        return responseObj;
    }

    /**
     * Gets the HTTP GET URL.
     *
     * @protected
     * @param {{}} message The message.
     * @param {MessagingClientContext} [options] Optional. Options controlling the command processing.
     * @returns {string} The HTTP GET URL.
     * @memberof MessageProcessor
     */
    protected getHttpPostUrl(message: {}, options?: MessagingClientContext): string {
        let baseUrl = this.appSettings.baseUrl;
        if (!baseUrl.endsWith('/')) {
            baseUrl = baseUrl + '/';
        }

        const url = `${baseUrl}${this.baseRoute}`;
        return url;
    }

    /**
     * Gets the HTTP GET options. By default it does not return any options.
     *
     * @protected
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {MessagingClientContext} [options] Optional. Options controlling the command processing.
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
    protected getHttpPostOptions(message: {}, options?: MessagingClientContext): {
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

    private _processResponse<T extends ResponseMessage>(rawResponse: RawResponseMessage<T>, options?: MessagingClientContext): T {
        if (rawResponse.exception) {
            const errorInfo = rawResponse.exception;
            if (typeof errorInfo.severity === 'string') {
                errorInfo.severity = (LogLevel as Expando)[errorInfo.severity as string];
            }

            throw new MessagingError(errorInfo.message!, errorInfo);
        }

        const response = rawResponse.message;
        if (typeof response.severity === 'string') {
            response.severity = (LogLevel as Expando)[response.severity as string];
        }

        if (response.severity <= LogLevel.Error) {
            throw new MessagingError(response.message!, response);
        }

        if (response.severity === LogLevel.Warning) {
            this.logger.log(response.severity, null, response.message!);
            if (!(options && (options.notifyWarnings === undefined || options.notifyWarnings))) {
                this.notification.notifyWarning(response);
            }
        }

        if (response.severity <= LogLevel.Error) {
            throw new MessagingError(response.message!, response);
        }
        return response;
    }

    private _processError<T extends ResponseMessage>(error: any, options?: MessagingClientContext): ObservableInput<T> {
        this.logger.error(error);
        if (!(options && (options.notifyErrors === undefined || options.notifyErrors))) {
            this.notification.notifyError(error);
        }

        throw error;
    }
}
