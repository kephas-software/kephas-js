import { AppServiceInfoRegistry } from './appServiceInfoRegistry';
import { expect } from 'chai';
import 'mocha';
import { AppServiceInfo } from './appServiceInfo';

abstract class ManualRegisteredService {}
class DefaultManualRegisteredService extends ManualRegisteredService {}

describe('AppServiceInfoRegistry.registerService', () => {
    it('should connect properly the service type and the service contract', () => {
        let registry = new AppServiceInfoRegistry();
        registry
            .registerServiceContract(ManualRegisteredService, new AppServiceInfo({ contractType: ManualRegisteredService }))
            .registerService(DefaultManualRegisteredService);

        for(let service of registry.services) {
            expect(service.implementationType).to.equal(DefaultManualRegisteredService);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(ManualRegisteredService);
        }
    });
});
