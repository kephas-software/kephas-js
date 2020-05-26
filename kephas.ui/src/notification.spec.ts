import { expect } from 'chai';
import 'mocha';

import { AppServiceInfoRegistry, CompositionContext, Logger } from '@kephas/core';
import { Notification } from '.';

describe('Notification.composition', () => {
    it('should be registered as service', () => {
        expect(AppServiceInfoRegistry.Instance.isServiceContract(Notification)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(Notification)).is.true;
    });

    it('should be properly initialized', () => {
        let injector = new CompositionContext(AppServiceInfoRegistry.Instance);
        let logger = injector.get(Logger);
        let notification = injector.get(Notification);

        expect(notification).is.not.null;
        expect(notification["logger"]).is.equal(logger);
    });
});
