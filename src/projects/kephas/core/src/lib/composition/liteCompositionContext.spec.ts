import { expect } from 'chai';
import 'mocha';

import {
    CompositionContext, LiteCompositionContext, AppServiceInfoRegistry, AppService,
    AppServiceContract, SingletonAppServiceContract
} from '..';
import 'reflect-metadata';

describe('LiteCompositionContext.get', () => {
    /*
        This test should be the first in the row, otherwise will fail.
    */
    it('should get its registry as the AppServiceInfoRegistry (default)', () => {
        const registry = AppServiceInfoRegistry.Instance;
        const injector = LiteCompositionContext.Instance;

        const actualRegistry = injector.get(AppServiceInfoRegistry);
        const sameRegistry = AppServiceInfoRegistry.Instance;
        expect(actualRegistry === registry).to.be.true;
    });

    it('should get itself as the CompositionContext', () => {
        const registry = new AppServiceInfoRegistry();
        const injector = new LiteCompositionContext(registry);

        expect(injector.get(CompositionContext)).is.equal(injector);
    });

    it('should get its registry as the AppServiceInfoRegistry (custom)', () => {
        const registry = new AppServiceInfoRegistry();
        const injector = new LiteCompositionContext(registry);

        expect(injector.get(AppServiceInfoRegistry) === registry).to.be.true;
    });

    it('should resolve dependencies', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @AppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [CompositionContext], Test);

        const injector = new LiteCompositionContext(testRegistry);
        const test = injector.get(Test);

        expect(test).is.not.null;
        expect(test.injector).is.equal(injector);
    });

    it('should respect transitive services', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @AppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [CompositionContext], Test);

        const injector = new LiteCompositionContext(testRegistry);
        const test = injector.get(Test);
        const test2 = injector.get(Test);

        expect(test).is.not.equal(test2);
    });

    it('should respect singleton services', () => {
        const testRegistry = new AppServiceInfoRegistry();
        @AppService({ registry: testRegistry })
        @SingletonAppServiceContract({ registry: testRegistry })
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata('design:paramtypes', [CompositionContext], Test);

        const injector = new LiteCompositionContext(testRegistry);
        const test = injector.get(Test);
        const test2 = injector.get(Test);

        expect(test).is.equal(test2);
    });
});

describe('LiteCompositionContext.constructor', () => {
    it('should add itself to the custom registry', () => {

        const registry = new AppServiceInfoRegistry();
        const injector = new LiteCompositionContext(registry);

        for (const service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(LiteCompositionContext);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(CompositionContext);
        }
    });
});
