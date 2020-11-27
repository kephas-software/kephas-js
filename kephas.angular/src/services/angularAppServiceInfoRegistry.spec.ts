import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, SingletonAppServiceContract, AppService } from '@kephas/core';
import { AngularAppServiceInfoRegistry } from '..';
import { HttpClient, HttpHandler } from '@angular/common/http';

const registry = new AppServiceInfoRegistry();

@SingletonAppServiceContract({ registry })
abstract class TestServiceContract {}

@AppService({ registry })
class TestService extends TestServiceContract {}

describe('AngularAppServiceInfoRegistry.getRootProviders', () => {
    it('should return registered services', () => {
        const angularRegistry = new AngularAppServiceInfoRegistry(registry);
        const providers = angularRegistry.getRootProviders();
        expect(providers.length).to.equal(6);
        expect(providers[1].provide).to.equal(TestServiceContract);
        expect(providers[1].useClass).to.equal(TestService);
        expect(providers[1].multi).to.be.false;
    });

    it('should return http client services', () => {
        const angularRegistry = new AngularAppServiceInfoRegistry(AppServiceInfoRegistry.Instance);
        const providers = angularRegistry.getRootProviders();
        expect(providers.length).to.greaterThan(15);
        const provider = providers.find(p => p.provide === HttpClient);
        expect(provider).not.null;
        expect(provider!.useClass).to.equal(HttpClient);
        expect(provider!.multi).to.be.false;
        expect(provider!.deps.length).to.equal(1);
        expect(provider!.deps[0]).to.equal(HttpHandler);
    });
});
