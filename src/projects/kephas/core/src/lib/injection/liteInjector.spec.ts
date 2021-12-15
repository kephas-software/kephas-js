import { expect } from 'chai';
import 'mocha';

import 'reflect-metadata';

import { LiteInjector } from '../injection/liteInjector';
import { AppService } from '../services/appService';
import { AppServiceContract, SingletonAppServiceContract } from '../services/appServiceContract';
import { AppServiceInfoRegistry } from '../services/appServiceInfoRegistry';
import { Injector } from './injector';

describe('LiteInjector.get', () => {
    /*
        This test should be the first in the row, otherwise will fail.
    */
    it('should get its registry as the AppServiceInfoRegistry (default)', () => {
        const registry = AppServiceInfoRegistry.Instance;
        const injector = LiteInjector.Instance;

        const actualRegistry = injector.resolve(AppServiceInfoRegistry);
        const sameRegistry = AppServiceInfoRegistry.Instance;
        expect(actualRegistry === registry).to.be.true;
    });

    it('should get itself as the Injector', () => {
        const registry = new AppServiceInfoRegistry();
        const injector = new LiteInjector(registry);

        expect(injector.resolve(Injector)).is.equal(injector);
    });

    it('should get its registry as the AppServiceInfoRegistry (custom)', () => {
        const registry = new AppServiceInfoRegistry();
        const injector = new LiteInjector(registry);

        expect(injector.resolve(AppServiceInfoRegistry) === registry).to.be.true;
    });

    it('should resolve dependencies', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @AppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: Injector) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [Injector], Test);

        const injector = new LiteInjector(testRegistry);
        const test = injector.resolve(Test);

        expect(test).is.not.null;
        expect(test.injector).is.equal(injector);
    });

    it('should respect transitive services', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @AppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: Injector) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [Injector], Test);

        const injector = new LiteInjector(testRegistry);
        const test = injector.resolve(Test);
        const test2 = injector.resolve(Test);

        expect(test).is.not.equal(test2);
    });

    it('should respect singleton services', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @SingletonAppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: Injector) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [Injector], Test);

        const injector = new LiteInjector(testRegistry);
        const test = injector.resolve(Test);
        const test2 = injector.resolve(Test);

        expect(test).is.equal(test2);
    });
});

describe('LiteInjector.constructor', () => {
    it('should add itself to the custom registry', () => {

        const registry = new AppServiceInfoRegistry();
        const injector = new LiteInjector(registry);

        for (const service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(LiteInjector);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(Injector);
        }
    });
});
