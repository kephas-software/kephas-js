import { AppServiceInfoRegistry } from '@kephas/core';
import { Notification } from './notification';
import { expect } from 'chai';
import 'mocha';

describe('Notification.composition', () => {
    it('should be registered as service', () => {
        expect(AppServiceInfoRegistry.Instance.isServiceContract(Notification)).is.true;
        expect(AppServiceInfoRegistry.Instance.isService(Notification)).is.true;
    });
});
