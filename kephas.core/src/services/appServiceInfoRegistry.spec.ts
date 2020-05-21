import { AppServiceInfoRegistry } from './appServiceInfoRegistry';
import { expect } from 'chai';
import 'mocha';
import { AppServiceInfo } from './appServiceInfo';
import { AppService } from './appService';
import { SingletonAppServiceContract } from './appServiceContract';
import { Priority } from './composition/appServiceMetadata';

abstract class ManuallyRegisteredService {}
class DefaultManuallyRegisteredService extends ManuallyRegisteredService {}

describe('AppServiceInfoRegistry.registerService_manually', () => {
    it('should connect properly the service type and the service contract', () => {
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
});

describe('AppServiceInfoRegistry.registerService_with_decorators_override', () => {
    it('should connect properly the service type and the service contract', () => {
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
});

