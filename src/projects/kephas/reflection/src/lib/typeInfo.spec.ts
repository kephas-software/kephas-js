import { expect } from 'chai';
import 'mocha';
import { Serializable, Namespace } from '@kephas/core';
import { TypeInfo, TypeName } from '.';

describe('TypeInfo.constructor', () => {
    it('should set the name and full name', () => {
        const typeInfo = new TypeInfo({ name: 'MyType' });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
    });

    it('should set the properties', () => {
        const typeInfo = new TypeInfo({
            name: 'MyType',
            properties: [
                {
                    name: 'name',
                    valueType: 'string',
                    isRequired: true,
                }
            ]
        });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
        expect(typeInfo.properties.length).to.equal(1);

        const property = typeInfo.properties[0];
        expect(property.name).to.equal('name');
        expect(property.isRequired).to.true;
    });

    it('should set the name and full name if namespace set (no type)', () => {
        const typeInfo = new TypeInfo({ name: 'MyType', namespace: 'This.Is.Namespace' });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the name and full name if namespace set (with type)', () => {
        class MyType { };
        const typeInfo = new TypeInfo({ type: MyType, namespace: 'This.Is.Namespace' });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the name and full name if namespace set in decorator (with type)', () => {
        @Namespace('This.Is.Namespace')
        class MyType { };

        const typeInfo = new TypeInfo({ type: MyType });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');

        expect(Serializable.getTypeFullName(MyType)).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the properties', () => {
        const typeInfo = new TypeInfo({ name: 'MyType' });
        expect(typeInfo.properties).to.not.null;
    });

    it('should set custom values', () => {
        const typeInfo = new TypeInfo({ name: 'MyType', hi: 'there' });
        expect(typeInfo['hi']).to.equal('there');
    });
});

describe('TypeInfo.isBoolean', () => {
    it('is set when boolean', () => {
        const typeInfo = new TypeInfo({ name: TypeName.BooleanTypeName });
        expect(typeInfo.isBoolean).to.true;
    });

    it('is not set when not boolean', () => {
        const typeInfo = new TypeInfo({ name: 'MyType' });
        expect(typeInfo.isBoolean).to.false;
    });
});
