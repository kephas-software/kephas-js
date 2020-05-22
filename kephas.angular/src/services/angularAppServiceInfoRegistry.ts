import { AppServiceInfoRegistry, Requires, AppServiceInfo, AppServiceMetadata, AbstractType } from "@kephas/core";
import { Injectable } from "@angular/core";

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
     * @memberof AngularAppServiceInfoRegistry
     */
    public registerServices() {
        for (let serviceMetadata of this.serviceRegistry.services) {
            Injectable({ providedIn: 'root' })(serviceMetadata.serviceType!);
        }
    }

    /**
     * Gets the providers for the root.
     *
     * @returns {{ provide: AbstractType; useClass: AbstractType; multi: boolean; }[]} An array of providers.
     * @memberof AngularAppServiceInfoRegistry
     */
    public getRootProviders(): { provide: AbstractType; useClass: AbstractType; multi: boolean; }[] {
        let providers: { provide: AbstractType, useClass: AbstractType; multi: boolean; }[] = [];
        for (let c of this.serviceRegistry.serviceContracts) {
            let serviceContract: AppServiceInfo = c;
            for (let m of serviceContract.services) {
                let serviceMetadata: AppServiceMetadata<any> = m;
                if (serviceMetadata.serviceType != serviceContract.contractType || serviceContract.allowMultiple) {
                    providers.push({
                        provide: serviceContract.contractType,
                        useClass: serviceMetadata.serviceType!,
                        multi: serviceContract.allowMultiple
                    });
                }
            }
        }

        return providers;
    }
}