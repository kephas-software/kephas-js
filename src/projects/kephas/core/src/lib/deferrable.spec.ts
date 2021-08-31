import { expect } from 'chai';
import 'mocha';

import { Deferrable, ArgumentError, ServiceError } from '.';

describe('Deferrable.promise', () => {
    it('should resolve properly', async () => {
        let deferrable = new Deferrable<boolean>();
        deferrable.resolve(true);

        let result = await deferrable.promise;
        expect(result).is.true;
    });

    it('should reject properly', async () => {
        let deferrable = new Deferrable<boolean>();
        deferrable.reject(new ArgumentError("test message", "test"));

        try {
            let result = await deferrable.promise;
            throw new ServiceError("should not get here.")
        }
        catch (error) {
            let errorMessage = error.message;
            let errorArgName = error.argName;
            if (errorArgName == "test" && errorMessage == "test message") {
                // OK
                return;
            }

            throw error;
        }
    });
});
