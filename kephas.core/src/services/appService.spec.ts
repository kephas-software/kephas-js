import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, AppServiceInfo, AppService, AppServiceLifetime } from '..';
import { SingletonAppServiceContract, AppServiceContract, Priority } from '..';
import { CompositionContext } from '../composition/compositionContext';

describe('AppService', () => {
    it('should register factory', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService {};
        const thisService = new MyService();
        
        AppService({registry: registry, overridePriority: Priority.High, provider: container => thisService})
            (MyService);

        const container = new CompositionContext(registry);
        
        expect(container.get(MyService)).equal(thisService);
    });

    it('should register instance', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService {};
        const thisService = new MyService();
        
        AppService({registry: registry, overridePriority: Priority.High, provider: thisService})
            (MyService);

        const container = new CompositionContext(registry);
        
        expect(container.get(MyService)).equal(thisService);
    });

    it('should register type', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService {};
        const thisService = new MyService();
        
        AppService({registry: registry, overridePriority: Priority.High})
            (MyService);

        const container = new CompositionContext(registry);
        
        expect(container.get(MyService)).is.instanceOf(MyService);
    });
});
