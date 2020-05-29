import { SingletonAppServiceContract, AppService, Priority } from "@kephas/core";

/**
 * Gets the application settings.
 *
 * @export
 * @class AppSettings
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class AppSettings {
    /**
     * Gets the base URL of the application.
     *
     * @readonly
     * @type {string}
     * @memberof AppSettings
     */
    get baseUrl(): string {
        const baseQuery = document.getElementsByTagName('base');
        const baseElement = baseQuery && baseQuery[0];
        return (baseElement && baseElement.href) || document.baseURI || "/";
    }
}