import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, AppServiceInfo, AppService, AppServiceLifetime } from '..';
import { SingletonAppServiceContract, AppServiceContract, Priority } from '..';

describe('AppServiceInfoRegistry.constructor', () => {
    it('should register itself', () => {
        let registry = new AppServiceInfoRegistry();

        for (let service of registry.services) {
            expect(service.serviceType).to.equal(AppServiceInfoRegistry);
            expect(service.serviceInstance).to.equal(registry);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(AppServiceInfoRegistry);
            expect(service.serviceContract!.lifetime).to.equal(AppServiceLifetime.Singleton);
        }
    });
});

describe('AppServiceInfoRegistry.registerService', () => {
    it('should match the contract and the service (manual registration)', () => {
        abstract class ManuallyRegisteredService { }
        class DefaultManuallyRegisteredService extends ManuallyRegisteredService { }

        let registry = new AppServiceInfoRegistry();
        registry
            .registerServiceContract(ManuallyRegisteredService, new AppServiceInfo({ contractType: ManuallyRegisteredService }))
            .registerService(DefaultManuallyRegisteredService);

        for (let service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(DefaultManuallyRegisteredService);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(ManuallyRegisteredService);
        }
    });

    it('should match the contract and the service with override (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @AppService({ overridePriority: Priority.Low, registry: registry })
        @SingletonAppServiceContract({ registry: registry })
        class DefaultService { }

        @AppService({ overridePriority: Priority.AboveNormal, registry: registry })
        class OverriddenService extends DefaultService { }

        for (let service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(OverriddenService);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(DefaultService);
        }
    });

    it('should match the abstract contract and the service (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        abstract class AbstractContract { }

        @AppService({ registry: registry })
        class Service extends AbstractContract { }

        for (let service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(Service);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(AbstractContract);
        }
    });


    it('should match the transient contract and the service (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @AppServiceContract({ registry: registry })
        abstract class AbstractContract { }

        @AppService({ registry: registry })
        class Service extends AbstractContract { }

        for (let service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(Service);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(AbstractContract);
        }
    });
});

describe('AppServiceInfoRegistry.isServiceContract', () => {
    it('should return true if registered (manual registration)', () => {
        abstract class ManuallyRegisteredService { }

        let registry = new AppServiceInfoRegistry();
        registry
            .registerServiceContract(ManuallyRegisteredService, new AppServiceInfo({ contractType: ManuallyRegisteredService }));

        expect(registry.isServiceContract(ManuallyRegisteredService)).is.true;
    });

    it('should return true if registered (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class DefaultService { }

        expect(registry.isServiceContract(DefaultService)).is.true;
    });

    it('should return false if not registered', () => {
        let registry = new AppServiceInfoRegistry();

        class NoDefaultService { }

        expect(registry.isServiceContract(NoDefaultService)).is.false;
    });
});

describe('AppServiceInfoRegistry.isService', () => {
    it('should return true if registered (manual registration)', () => {
        abstract class ManuallyRegisteredService { }
        class DefaultService extends ManuallyRegisteredService { }

        let registry = new AppServiceInfoRegistry();
        registry
            .registerServiceContract(ManuallyRegisteredService, new AppServiceInfo({ contractType: ManuallyRegisteredService }))
            .registerService(DefaultService);

        expect(registry.isService(DefaultService)).is.true;
        expect(registry.isService(ManuallyRegisteredService)).is.false;
    });

    it('should return true if registered (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @AppService()
        @SingletonAppServiceContract({ registry: registry })
        class DefaultService { }

        expect(registry.isService(DefaultService)).is.true;
    });

    it('should return false if not registered', () => {
        let registry = new AppServiceInfoRegistry();

        class NoDefaultService { }

        expect(registry.isService(NoDefaultService)).is.false;
    });
});
