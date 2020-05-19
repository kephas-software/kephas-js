import { TypeInfo } from '../src/typeInfo';
import { expect } from 'chai';
import 'mocha';

describe('Name is set', () => {
    it('should set log level to fatal', () => {
        let typeInfo = new TypeInfo({ name: "MyType", properties: [] });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
    });
});
