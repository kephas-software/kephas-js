import { HttpClient } from "@angular/common/http";
import { LogLevel, AppService, SingletonAppServiceContract, Priority } from "@kephas/core";
import { Notification } from "@kephas/ui";
import { AppSettings } from "..";

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
 * Options for controlling the command execution.
 *
 * @export
 * @interface ProcessOptions
 */
export interface ProcessOptions {
    hideWarnings?: boolean;
    hideErrors?: boolean;
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
        protected notification: Notification,
        protected http: HttpClient,
        protected appSettings: AppSettings) {
    }

    /**
     * Processes the command asynchronously.
     * @tparam T The message response type.
     * @param {string} command The command.
     * @param {{}} [args] Optional. The arguments.
     * @param {ProcessOptions} [options] Optional. Options controlling the processing.
     * @returns {Promise{T}} A promise of the result.
     */
    async processAsync<T extends MessageResponse>(command: string, args?: {}, options?: ProcessOptions): Promise<T> {
        let url = `${this.appSettings.baseUrl}${this.baseRoute}${command}/`;
        if (args) {
            url = url + Object.keys(args)
                .map(key => `${key}=${args[key]}`)
                .join("&");
        }

        try {
            let response = await this.http.get<T>(url).toPromise();
            if (typeof response.severity === "string") {
                response.severity = LogLevel[response.severity as string];
            }

            if (response.severity != LogLevel.Info && !options?.hideErrors) {
                this.notification.notifyError(response);
            }
            else if (response.severity == LogLevel.Warning && !options?.hideWarnings) {
                this.notification.notifyWarning(response);
            }

            if (response.severity <= LogLevel.Error) {
                throw new Error(response.message);
            }
            return response;
        }
        catch (error) {
            if (!options?.hideErrors) {
                this.notification.notifyError(error);
            }

            throw error;
        }
    }
}
