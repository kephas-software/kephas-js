import { expect } from 'chai';
import 'mocha';

import { TypeInfoRegistry, TypeInfo } from '.';

describe('TypeInfoRegistry.constructor', () => {
    it('should register the primary types', () => {
        let registry = new TypeInfoRegistry();
        let type = registry.getType(TypeInfo.AnyTypeName)
        expect(type.name).to.equal(TypeInfo.AnyTypeName);
        expect(type.fullName).to.equal(TypeInfo.AnyTypeName);
    });
});
