import {
    SingletonAppServiceContract, AppService, Priority, Expando
} from '@kephas/core';

/**
 * Gets the application settings.
 *
 * @export
 * @class AppSettings
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class AppSettings implements Expando {

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
        return (baseElement && baseElement.href) || document.baseURI || '/';
    }

    /**
     * Gets the base API URL of the application.
     *
     * @readonly
     * @type {string}
     * @memberof AppSettings
     */
    get baseApiUrl(): string {
        return `${this.baseUrl}api/`
    }
}