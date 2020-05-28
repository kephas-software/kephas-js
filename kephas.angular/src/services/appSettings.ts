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
        return document.getElementsByTagName('base')[0].href ?? document.baseURI ?? "/";
    }
}