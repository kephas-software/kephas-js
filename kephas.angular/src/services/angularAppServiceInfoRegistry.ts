import {
    AppServiceInfoRegistry, Requires, AppServiceInfo, AppServiceMetadata
} from '@kephas/core';
import { Injectable, Type, StaticClassProvider } from '@angular/core';
import 'reflect-metadata';

/**
 * Helper class for registering the services with the Angular injector.
 *
 * @export
 * @class AngularAppServiceInfoRegistry
 */
export class AngularAppServiceInfoRegistry {

    /**
     * Creates an instance of AngularAppServiceInfoRegistry.
     *
     * @param {AppServiceInfoRegistry} serviceRegistry The service registry.
     * @memberof AngularAppServiceInfoRegistry
     */
    constructor(private serviceRegistry: AppServiceInfoRegistry) {
        Requires.HasValue(serviceRegistry, 'serviceRegistry');
    }

    /**
     * Registers the application services to the Angular DI container.
     *
     * @param {...string[]} modules The modules to import to collect the service metadata.
     * @memberof AngularAppServiceInfoRegistry
     */
    public registerServices() {
        for (const serviceMetadata of this.serviceRegistry.services) {
            Injectable({ providedIn: 'root' })(serviceMetadata.serviceType!);
        }
    }

    /**
     * Gets the providers for the root.
     *
     * @returns {StaticClassProvider[]}
     * @memberof AngularAppServiceInfoRegistry
     */
    public getRootProviders(): StaticClassProvider[] {
        const providers: StaticClassProvider[] = [];
        for (const c of this.serviceRegistry.serviceContracts) {
            const serviceContract: AppServiceInfo = c;
            for (const m of serviceContract.services) {
                const serviceMetadata: AppServiceMetadata<any> = m;
                providers.push({
                    provide: serviceContract.contractToken || serviceContract.contractType,
                    useClass: serviceMetadata.serviceType!,
                    multi: serviceContract.allowMultiple,
                    deps: Reflect.getMetadata('design:paramtypes', serviceMetadata.serviceType!) || [],
                });
            }
        }

        return providers;
    }
}