import { expect } from 'chai';
import 'mocha';

import { CommandProcessorClient } from '.';
import { LiteCompositionContext } from '@kephas/core';

describe('CommandProcessorClient.composition', () => {
    it('should be available', () => {
        const container = LiteCompositionContext.Instance;
        const processor = container.get(CommandProcessorClient);
        expect(processor).to.be.instanceOf(CommandProcessorClient);
    });
});

describe('CommandProcessorClient.process', () => {
    it('should fail', () => {
        const processor = new CommandProcessorClient();
        expect(() => processor.process('help')).to.throw();
    });
});