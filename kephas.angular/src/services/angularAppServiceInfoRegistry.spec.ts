import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, SingletonAppServiceContract, AppService } from '@kephas/core';
import { AngularAppServiceInfoRegistry } from '..';

let registry = new AppServiceInfoRegistry();

@SingletonAppServiceContract({ registry })
abstract class TestServiceContract {}

@AppService({ registry })
class TestService extends TestServiceContract {}

describe('AngularAppServiceInfoRegistry.getRootProviders', () => {
    it('should return registered services', () => {
        let angularRegistry = new AngularAppServiceInfoRegistry(registry);
        const providers = angularRegistry.getRootProviders();
        expect(providers.length).to.equal(2);
        expect(providers[1].provide).to.equal(TestServiceContract);
        expect(providers[1].useClass).to.equal(TestService);
        expect(providers[1].multi).to.false;
    });
});
