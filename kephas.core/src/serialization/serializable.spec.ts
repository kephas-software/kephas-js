import { expect } from 'chai';
import 'mocha';

import { Serializable, Namespace } from '..';

describe('Serializable.setTypeName', () => {
    it('should set and get the type name', () => {
        class TestClass {};

        Serializable.setTypeName(TestClass, "NS.TestClass");
        const typeName = Serializable.getTypeName(TestClass);
        expect(typeName).to.equal('NS.TestClass');
    });
});

describe('Serializable.getTypeName', () => {
    it('should return undefined if not set', () => {
        class TestClass {};

        let typeName = Serializable.getTypeName(TestClass);
        expect(typeName).to.is.undefined;
    });
});

describe('Serializable.setTypeNamespace', () => {
    it('should set and get the type namespace', () => {
        class TestClass {};

        Serializable.setTypeNamespace(TestClass, "NS");
        const typeName = Serializable.getTypeNamespace(TestClass);
        expect(typeName).to.equal('NS');
    });
});

describe('Serializable.getTypeNamespace', () => {
    it('should return undefined if not set', () => {
        class TestClass {};

        let ns = Serializable.getTypeNamespace(TestClass);
        expect(ns).to.is.undefined;
    });
});

describe('Serializable.getJSON', () => {
    it('should return correct JSON (when no type name set)', () => {
        class TestClass { a?: string; _b?: number; };
        const instance = new TestClass();
        instance.a = "abc";
        instance._b = 12;

        const json = Serializable.getJSON(instance);
        expect(json).to.not.null;
        expect(json["$type"]).to.equal('TestClass');
        expect(json["a"]).to.equal('abc');
        expect(json["_b"]).to.undefined;
    });

    it('should return correct JSON (when no type name set - with namespace)', () => {
        @Namespace("NS")
        class TestClass { a?: string; _b?: number; };
        const instance = new TestClass();
        instance.a = "abc";
        instance._b = 12;

        const json = Serializable.getJSON(instance);
        expect(json).to.not.null;
        expect(json["$type"]).to.equal('NS.TestClass');
        expect(json["a"]).to.equal('abc');
        expect(json["_b"]).to.undefined;
    });

    it('should return correct JSON (when type name set)', () => {
        class TestClass { a?: string; _b?: number; };
        Serializable.setTypeName(TestClass, 'MyTestClass');
        const instance = new TestClass();
        instance.a = "abc";
        instance._b = 12;

        const json = Serializable.getJSON(instance);
        expect(json).to.not.null;
        expect(json["$type"]).to.equal('MyTestClass');
        expect(json["a"]).to.equal('abc');
        expect(json["_b"]).to.undefined;
    });
});

describe('Serializable.getString', () => {
    it('should return correct string', () => {
        class TestClass { a?: string; _b?: number; };
        const instance = new TestClass();
        instance.a = "abc";
        instance._b = 12;

        const str = Serializable.getString(instance);
        expect(str).to.equal('{"$type":"TestClass","a":"abc"}');
    });
});

