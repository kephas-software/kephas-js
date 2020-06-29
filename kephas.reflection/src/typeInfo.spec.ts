import { expect } from 'chai';
import 'mocha';
import { Serializable, Namespace } from '@kephas/core';
import { TypeInfo } from '.';

describe('TypeInfo.constructor', () => {
    it('should set the name and full name', () => {
        let typeInfo = new TypeInfo({ name: "MyType" });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.fullName).to.equal('MyType');
    });

    it('should set the name and full name if namespace set (no type)', () => {
        let typeInfo = new TypeInfo({ name: "MyType", namespace: "This.Is.Namespace" });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the name and full name if namespace set (with type)', () => {
        class MyType {};
        let typeInfo = new TypeInfo({ type: MyType, namespace: "This.Is.Namespace" });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the name and full name if namespace set in decorator (with type)', () => {
        @Namespace("This.Is.Namespace")
        class MyType {};

        let typeInfo = new TypeInfo({ type: MyType });
        expect(typeInfo.name).to.equal('MyType');
        expect(typeInfo.namespace).to.equal('This.Is.Namespace');
        expect(typeInfo.fullName).to.equal('This.Is.Namespace.MyType');

        expect(Serializable.getTypeFullName(MyType)).to.equal('This.Is.Namespace.MyType');
    });

    it('should set the properties', () => {
        let typeInfo = new TypeInfo({ name: "MyType" });
        expect(typeInfo.properties).to.not.null;
    });

    it('should set custom values', () => {
        let typeInfo = new TypeInfo({ name: "MyType", hi: "there" });
        expect(typeInfo["hi"]).to.equal("there");
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
