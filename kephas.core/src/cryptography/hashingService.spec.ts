import { expect } from 'chai';
import 'mocha';

import { HashingService } from '..';

describe('HashingService.hash', () => {
    it('should compute correctly', () => {
        var hasher = new HashingService();
        var hash = hasher.hash('hello');

        expect(hash).to.equal('LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=');
    });
});

