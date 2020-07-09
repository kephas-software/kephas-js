import { expect } from 'chai';
import 'mocha';

import {
    AppServiceInfoRegistry, AppService, SingletonAppServiceContract,
    Priority, CompositionContext, LiteCompositionContext
} from '..';

describe('AppService', () => {
    it('should register factory', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High, provider: container => thisService })
            (MyService);

        const container = new LiteCompositionContext(registry);

        expect(container.get(MyService)).equal(thisService);
    });

    it('should register instance', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High, provider: thisService })
            (MyService);

        const container = new LiteCompositionContext(registry);

        expect(container.get(MyService)).equal(thisService);
    });

    it('should register type', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High })
            (MyService);

        const container = new LiteCompositionContext(registry);

        expect(container.get(MyService)).is.instanceOf(MyService);
    });
});
