import { expect } from 'chai';
import 'mocha';

import { EventHub } from '..';

describe('EventHub.subscribe', () => {
    it('should match type', async () => {
        const eventHub = new EventHub();
        let date = new Date('2020-03-25');
        eventHub.subscribe(Date, d => { date = d; });

        await eventHub.publishAsync(new Date('2020-12-25'));

        expect(date.getMonth()).is.equal(11);

        await eventHub.publishAsync('2020-08-06');

        expect(date.getMonth()).is.equal(11);
    });

    it('should not invoke callback after dispose', async () => {
        const eventHub = new EventHub();
        let date = new Date('2020-03-25');
        const subscription = eventHub.subscribe(Date, d => { date = d; });

        await eventHub.publishAsync(new Date('2020-12-25'));

        expect(date.getMonth()).is.equal(11);

        subscription.dispose();

        await eventHub.publishAsync(new Date('2020-08-06'));

        expect(date.getMonth()).is.equal(11);
    });
});
