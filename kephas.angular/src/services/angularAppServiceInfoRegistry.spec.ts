import { AppServiceInfoRegistry, SingletonAppServiceContract, AppService } from '@kephas/core';
import { AngularAppServiceInfoRegistry } from './angularAppServiceInfoRegistry';
import { expect } from 'chai';
import 'mocha';

let registry = new AppServiceInfoRegistry();

@SingletonAppServiceContract({ registry })
abstract class TestServiceContract {}

@AppService({ registry })
class TestService extends TestServiceContract {}

describe('AngularAppServiceInfoRegistry.getRootProviders', () => {
    it('should return registered services', () => {
        let angularRegistry = new AngularAppServiceInfoRegistry(registry);
        const providers = angularRegistry.getRootProviders();
        expect(providers.length).to.equal(1);
        expect(providers[0].provide).to.equal(TestServiceContract);
        expect(providers[0].useClass).to.equal(TestService);
        expect(providers[0].multi).to.false;
    });
});
