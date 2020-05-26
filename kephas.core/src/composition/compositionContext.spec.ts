import { expect } from 'chai';
import 'mocha';

import { CompositionContext, AppServiceInfoRegistry, AppService, AppServiceContract, SingletonAppServiceContract } from '..';
import "reflect-metadata";

describe('CompositionContext.constructor', () => {
    it('should add itself to the custom registry', () => {

        let registry = new AppServiceInfoRegistry();
        let injector = new CompositionContext(registry);

        for (let service of [...registry.services].filter(s => s.serviceContract!.contractType != AppServiceInfoRegistry)) {
            expect(service.serviceType).to.equal(CompositionContext);
            expect(service.serviceContract).to.not.null;
            expect(service.serviceContract!.contractType).to.equal(CompositionContext);
        }
    });
});

describe('CompositionContext.get', () => {
    it('should get itself as the CompositionContext', () => {
        let registry = new AppServiceInfoRegistry();
        let injector = new CompositionContext(registry);

        expect(injector.get(CompositionContext)).is.equal(injector);
    });

    it('should get its registry as the AppServiceInfoRegistry', () => {
        let registry = new AppServiceInfoRegistry();
        let injector = new CompositionContext(registry);

        expect(injector.get(AppServiceInfoRegistry)).is.equal(registry);
    });

    it('should resolve dependencies', () => {
        let testRegistry = new AppServiceInfoRegistry();
        @AppService({registry: testRegistry})
        @AppServiceContract({registry: testRegistry})
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata("design:paramtypes", [ CompositionContext ], Test);

        let injector = new CompositionContext(testRegistry);
        let test = injector.get(Test);

        expect(test).is.not.null;
        expect(test.injector).is.equal(injector);
    });

    it('should respect transitive services', () => {
        let testRegistry = new AppServiceInfoRegistry();
        @AppService({registry: testRegistry})
        @AppServiceContract({registry: testRegistry})
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata("design:paramtypes", [ CompositionContext ], Test);

        let injector = new CompositionContext(testRegistry);
        let test = injector.get(Test);
        let test2 = injector.get(Test);

        expect(test).is.not.equal(test2);
    });

    it('should respect singleton services', () => {
        let testRegistry = new AppServiceInfoRegistry();
        @AppService({registry: testRegistry})
        @SingletonAppServiceContract({registry: testRegistry})
        class Test {
            constructor(public injector: CompositionContext) {
            }
        }

        Reflect.defineMetadata("design:paramtypes", [ CompositionContext ], Test);

        let injector = new CompositionContext(testRegistry);
        let test = injector.get(Test);
        let test2 = injector.get(Test);

        expect(test).is.equal(test2);
    });
});