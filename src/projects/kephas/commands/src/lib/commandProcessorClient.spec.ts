import { expect } from 'chai';
import 'mocha';

import { LiteInjector } from '@kephas/core';
import { CommandProcessorClient } from './commandProcessorClient';

describe('CommandProcessorClient.composition', () => {
    it('should be available', () => {
        const container = LiteInjector.Instance;
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
