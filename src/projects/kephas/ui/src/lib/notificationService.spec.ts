import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, Logger, LiteCompositionContext } from '@kephas/core';
import { NotificationService } from '.';

describe('NotificationService.composition', () => {
    it('should be registered as service', () => {
        expect(AppServiceInfoRegistry.Instance.isServiceContract(NotificationService)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(NotificationService)).is.true;
    });

    it('should be properly initialized', () => {
        let injector = new LiteCompositionContext(AppServiceInfoRegistry.Instance);
        let logger = injector.get(Logger);
        let notification = injector.get(NotificationService);

        expect(notification).is.not.null;
        expect(notification["logger"]).is.equal(logger);
    });
});
