import { expect } from 'chai';
import 'mocha';

import { Args } from '..';

describe('Args.ctor', () => {
    it('should be initialized from string', async () => {
        const args = new Args('--arg1 val1 -arg2 "val2"');

        expect(args["arg1"]).is.equal("val1");
        expect(args["arg2"]).is.equal("val2");
    });

    it('should be initialized from string array', async () => {
        const args = new Args(['--arg1', 'val1', '-arg2', '"val2"']);

        expect(args["arg1"]).is.equal("val1");
        expect(args["arg2"]).is.equal("val2");
    });

    it('should be initialized from object', async () => {
        const args = new Args({ arg1: "val1", arg2: "val2" });

        expect(args["arg1"]).is.equal("val1");
        expect(args["arg2"]).is.equal("val2");
    });
});
