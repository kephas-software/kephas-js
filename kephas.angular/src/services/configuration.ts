import { Injectable, Type } from '@angular/core';
import { HttpClient, HttpResponse as HttpResponse } from '@angular/common/http';
import { SingletonAppServiceContract, AppService, Priority, AsyncInitializable } from '@kephas/core';

@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class Configuration implements AsyncInitializable {

    private static readonly configurationFileUrl = '/app/configuration.json';

    private static configurationFile: {};

    /**
     * Ensures that the configuration file is initialized.
     *
     * @param {Http} http The http service.
     * @returns {Promise<void>} The promise.
     * @memberof Configuration
     */
    public async initializeAsync(http: HttpClient): Promise<void> {
        if (Configuration.configurationFile) {
            return;
        }

        const response = await http.get(Configuration.configurationFileUrl).toPromise();
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
    public getSettings<T>(sectionName: string): T {

        if (!Configuration.configurationFile) {
            throw new Error('The configuration manager must be initialized prior to requesting settings from it.');
        }

        return Configuration.configurationFile[sectionName];
    }
}
