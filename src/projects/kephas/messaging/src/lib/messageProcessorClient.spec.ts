import { expect } from 'chai';
import 'mocha';

import { MessageProcessorClient } from '.';
import { LiteInjector } from '@kephas/core';

describe('MessageProcessorClient.composition', () => {
    it('should be available', () => {
        const container = LiteInjector.Instance;
        const processor = container.get(MessageProcessorClient);
        expect(processor).to.be.instanceOf(MessageProcessorClient);
    });
});

describe('MessageProcessorClient.process', () => {
    it('should fail', () => {
        const processor = new MessageProcessorClient();
        expect(() => processor.process({})).to.throw();
    });
});
