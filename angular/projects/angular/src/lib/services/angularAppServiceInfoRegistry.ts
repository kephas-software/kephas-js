import 'reflect-metadata';
import {
    AppServiceInfoRegistry, Requires, AppServiceInfo, AppServiceMetadata, Type
} from '@kephas/core';
import { Injectable, StaticClassProvider } from '@angular/core';
import { HttpClientAppServiceInfoRegistry } from '../../public-api';

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
    public getRootProviders(): (StaticClassProvider )[] {
        const providers: (StaticClassProvider )[] = [];
        for (const c of this.serviceRegistry.serviceContracts) {
            const serviceContract: AppServiceInfo = c;
            for (const m of serviceContract.services) {
                const serviceMetadata: AppServiceMetadata<any> = m;
                providers.push({
                    provide: serviceContract.contractToken || serviceContract.contractType,
                    useClass: serviceMetadata.serviceType!,
                    multi: serviceContract.allowMultiple,
                    deps: this.getDependencies(serviceMetadata.serviceType!),
                });
            }
        }

        providers.push(...new HttpClientAppServiceInfoRegistry().getHttpClientProviders());

        return providers;
    }

    private getDependencies(serviceType: Type<any>): any[] {
        let deps = Reflect.getMetadata('design:paramtypes', serviceType);
        if(!deps && serviceType.ctorParameters) {
            deps = serviceType.ctorParameters();
        }

        return deps || [];
    }
}
