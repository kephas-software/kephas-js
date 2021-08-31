import { SingletonAppServiceContract, AppService, Priority, Logger, LogLevel } from '@kephas/core';

/**
 * Notification service.
 *
 * @export
 * @class NotificationService
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class NotificationService {
    /**
     * Gets or sets the logger.
     *
     * @protected
     * @type {Logger}
     * @memberof NotificationService
     */
    protected logger: Logger;

    /**
     * Creates an instance of Notification.
     * @param {Logger} [logger] Optional. The logger.
     * @memberof NotificationService
     */
    constructor(logger?: Logger) {
        this.logger = logger || new Logger();
    }

    /**
     * Notifies the message at error level.
     *
     * @param {*} data The information to be displayed.
     * @memberof NotificationService
     */
    public notifyError(data: any) {
        // debugger;
        const severityString = data.severity || LogLevel[LogLevel.Error];
        const severity = severityString === LogLevel[LogLevel.Warning]
            ? LogLevel.Warning
            : LogLevel.Error;
        this.show(this.formatData(data), severity);
    }

    /**
     * Notifies the message at warning level.
     *
     * @param {*} data The information to be displayed.
     * @memberof NotificationService
     */
    public notifyWarning(data: any) {
        // debugger;
        const severityString = data.severity || LogLevel[LogLevel.Warning];
        const severity = severityString === LogLevel[LogLevel.Warning]
            ? LogLevel.Warning
            : LogLevel.Error;
        this.show(this.formatData(data), severity);
    }

    /**
     * Notifies the message at information level.
     *
     * @param {*} data The information to be displayed.
     * @memberof NotificationService
     */
    public notifyInfo(data: any) {
        this.show(this.formatData(data), LogLevel.Info);
    }

    /**
     * Shows the notification.
     *
     * @protected
     * @param {*} formattedData The formatted data.
     * @param {LogLevel} severity The severity.
     * @memberof NotificationService
     */
    protected show(formattedData: any, severity: LogLevel) {
        this.logger.log(severity, null, formattedData);
    }

    /**
     * Formats the data. By default it returns a formatted string.
     *
     * @protected
     * @param {*} data The information to be formatted.
     * @returns {string}
     * @memberof NotificationService
     */
    protected formatData(data: any): any {
        if (!data) {
            return 'Unknown error. Please check the client and server logs for more information.';
        }

        if (data.message && data.url) {
            return `${data.message} (url: ${data.url}).`;
        }

        if (typeof (data) === 'object') {
            if (data.error) {
                // this is the case of Kendo data objects.
                if (typeof data.error === 'object') {
                    if (data.error.responseStatus) {
                        return data.error.responseStatus.message;
                    }
                }
                return data.error;
            }

            if (data.message) {
                return data.message;
            }
        }

        return data;
    }
}
