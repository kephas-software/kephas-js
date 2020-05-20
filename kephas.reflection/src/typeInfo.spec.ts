import { TypeInfo } from './typeInfo';
import { expect } from 'chai';
import 'mocha';

describe('TypeInfo.constructor', () => {
    it('should set the name and full name', () => {
        let typeInfo = new TypeInfo({ name: "MyType", properties: [] });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
    });
});
