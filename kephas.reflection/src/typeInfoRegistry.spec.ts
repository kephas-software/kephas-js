import * as Reflection from './index';
import { expect } from 'chai';
import 'mocha';

describe('TypeInfoRegistry.constructor', () => {
    it('should register the primary types', () => {
        let registry = new Reflection.TypeInfoRegistry();
        let type = registry.getType(Reflection.TypeInfo.AnyTypeName)
        expect(type.name).to.equal(Reflection.TypeInfo.AnyTypeName);
        expect(type.fullName).to.equal(Reflection.TypeInfo.AnyTypeName);
    });
});
