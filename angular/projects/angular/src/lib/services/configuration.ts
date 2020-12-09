import { Type } from '@angular/core';
import { HttpClient, HttpResponse as HttpResponse } from '@angular/common/http';
import {
    SingletonAppServiceContract, AppService, Priority,
    AsyncInitializable,
    Expando
} from '@kephas/core';

@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class Configuration implements AsyncInitializable {

    private static readonly configurationFileUrl = '/app/configuration.json';

    private static configurationFile: {};

    /**
     * Ensures that the configuration file is initialized.
     *
     * @param {{ http: HttpClient, configurationFileUrl?: string }} context The context containing initialization data.
     * @returns {Promise<void>}
     * @memberof Configuration
     */
    public async initializeAsync(context: { http: HttpClient, configurationFileUrl?: string }): Promise<void> {
        if (Configuration.configurationFile) {
            return;
        }

        const response = await context.http.get(context.configurationFileUrl ? context.configurationFileUrl : Configuration.configurationFileUrl).toPromise();
        Configuration.configurationFile = response || {};
    }

    /**
     * Gets the configuration settings for the indicated section name.
     *
     * @template T The settings type.
     * @param {string} sectionName The section name.
     * @returns {T} The settings.
     * @memberof Configuration
     */
    public getSettings<T>(settingsType: Type<T>): T {

        if (!Configuration.configurationFile) {
            throw new Error('The configuration manager must be initialized prior to requesting settings from it.');
        }

        let sectionName = settingsType.name;
        const ending = 'Settings';
        if (sectionName.endsWith(ending)) {
            sectionName = sectionName.substr(0, sectionName.length - ending.length);
        }

        sectionName = sectionName[0].toLowerCase() + sectionName.substr(1, sectionName.length - 1);

        return (Configuration.configurationFile as Expando)[sectionName];
    }
}
