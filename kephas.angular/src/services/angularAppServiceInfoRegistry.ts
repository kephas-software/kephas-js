import { AppServiceInfoRegistry, Requires } from "@kephas/core";
import {Type} from "@angular/core";

export class AngularAppServiceInfoRegistry {

    /**
     * Creates an instance of AngularAppServiceInfoRegistry.
     * @param {AppServiceInfoRegistry} serviceRegistry The service registry
     * @memberof AngularAppServiceInfoRegistry
     */
    constructor(public readonly serviceRegistry: AppServiceInfoRegistry) {
        Requires.HasValue(serviceRegistry, 'serviceRegistry');
    }

    /**
     * Registers the application services to the Angular DI container.
     *
     * @memberof AngularAppServiceInfoRegistry
     */
    public registerServices() {
        // TODO
    }

    /**
     * Gets the providers for the root.
     *
     * @memberof AngularAppServiceInfoRegistry
     */
    public getRootProviders() {
        // TODO
        let x: Type = null;
    }
}