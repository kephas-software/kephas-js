import { expect } from 'chai';
import 'mocha';

import { LiteInjector } from '../injection/liteInjector';
import { AppService } from './appService';
import { SingletonAppServiceContract } from './appServiceContract';
import { AppServiceInfoRegistry } from './appServiceInfoRegistry';
import { Priority } from './appServiceMetadata';

describe('AppService', () => {
    it('should register factory', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High, provider: container => thisService })
            (MyService);

        const container = new LiteInjector(registry);

        expect(container.resolve(MyService)).equal(thisService);
    });

    it('should register instance', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High, provider: thisService })
            (MyService);

        const container = new LiteInjector(registry);

        expect(container.resolve(MyService)).equal(thisService);
    });

    it('should register type', () => {
        const registry = new AppServiceInfoRegistry();

        @SingletonAppServiceContract({ registry: registry })
        class MyService { };
        const thisService = new MyService();

        AppService({ registry: registry, overridePriority: Priority.High })
            (MyService);

        const container = new LiteInjector(registry);

        expect(container.resolve(MyService)).is.instanceOf(MyService);
    });
});
