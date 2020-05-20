import { expect } from 'chai';
import 'mocha';

describe('Fatal logging', () => {
    it('should set log level to fatal', () => {
        let registry = new AppServiceInfoRegistry();
        logger.fatal('message');
        const result = logger.content;
        expect(result).to.equal('0,message\n');
    });
});
