import { AppServiceInfoRegistry } from './appServiceInfoRegistry';
import { expect } from 'chai';
import 'mocha';
import { AppServiceInfo } from './appServiceInfo';
import { AppService } from './appService';
import { SingletonAppServiceContract, AppServiceContract } from './appServiceContract';
import { Priority } from './composition/appServiceMetadata';

describe('AppServiceInfoRegistry.registerService', () => {
    it('should match the contract and the service (manual registration)', () => {
        abstract class ManuallyRegisteredService {}
        class DefaultManuallyRegisteredService extends ManuallyRegisteredService {}
        
        let registry = new AppServiceInfoRegistry();
        registry
            .registerServiceContract(ManuallyRegisteredService, new AppServiceInfo({ contractType: ManuallyRegisteredService }))
            .registerService(DefaultManuallyRegisteredService);

        for(let service of registry.services) {
            expect(service.serviceType).to.equal(DefaultManuallyRegisteredService);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(ManuallyRegisteredService);
        }
    });

    it('should match the contract and the service with override (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @AppService({ overridePriority: Priority.Low, registry: registry })
        @SingletonAppServiceContract({ registry: registry })
        class DefaultService {}
        
        @AppService({ overridePriority: Priority.AboveNormal, registry: registry })
        class OverriddenService extends DefaultService {}
        
        for(let service of registry.services) {
            expect(service.serviceType).to.equal(OverriddenService);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(DefaultService);
        }
    });

    it('should match the abstract contract and the service (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        abstract class AbstractContract {}
        
        @AppService({ registry: registry })
        class Service extends AbstractContract {}
        
        for(let service of registry.services) {
            expect(service.serviceType).to.equal(Service);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(AbstractContract);
        }
    });


    it('should match the transient contract and the service (decorator registration)', () => {
        let registry = new AppServiceInfoRegistry();

        @AppServiceContract({ registry: registry })
        abstract class AbstractContract {}
        
        @AppService({ registry: registry })
        class Service extends AbstractContract {}
        
        for(let service of registry.services) {
            expect(service.serviceType).to.equal(Service);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(AbstractContract);
        }
    });
});

