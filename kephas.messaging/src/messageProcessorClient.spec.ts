import { expect } from 'chai';
import 'mocha';

import { MessageProcessorClient } from '.';
import { LiteCompositionContext } from '@kephas/core';

describe('MessageProcessorClient.composition', () => {
    it('should be available', () => {
        const container = LiteCompositionContext.Instance;
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