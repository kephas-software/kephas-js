import { TypeInfo } from './typeInfo';
import { expect } from 'chai';
import 'mocha';

describe('TypeInfo.constructor', () => {
    it('should set the name and full name', () => {
        let typeInfo = new TypeInfo({ name: "MyType" });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
    });

    it('should set the properties', () => {
        let typeInfo = new TypeInfo({ name: "MyType" });
        expect(typeInfo.properties).to.not.null;
    });
});

describe('TypeInfo.isBoolean', () => {
    it('is set when boolean', () => {
        let typeInfo = new TypeInfo({ name: TypeInfo.BooleanTypeName });
        expect(typeInfo.isBoolean).to.true;
    });

    it('is not set when not boolean', () => {
        let typeInfo = new TypeInfo({ name: "MyType" });
        expect(typeInfo.isBoolean).to.false;
    });
});
