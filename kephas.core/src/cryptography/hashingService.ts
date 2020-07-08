import { sha256 } from 'js-sha256';
import { fromByteArray } from 'base64-js';

import { SingletonAppServiceContract, AppService, Priority } from '..';

/**
 * Provides the Hash method for hashing values.
 *
 * @export
 * @class HashingService
 */
@AppService({ overridePriority: Priority.Low })
@SingletonAppServiceContract()
export class HashingService {

    /**
     * Hashes the value producing a Base64 encoded string.
     *
     * @param {string} value The value to hash.
     * @returns {string} The hash value as a Base64 encoded string.
     * @memberof HashingService
     */
    public hash(value: string): string {
        const hashedValue = sha256.array(value);
        return fromByteArray(hashedValue as any);
    }
}