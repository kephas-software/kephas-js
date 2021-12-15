import { expect } from 'chai';
import 'mocha';

import { TypeInfoRegistry, TypeName } from '.';
import { LiteInjector } from '@kephas/core';

describe('TypeInfoRegistry.constructor', () => {
    it('should register the primary types', () => {
        const registry = new TypeInfoRegistry();
        const type = registry.getType(TypeName.AnyTypeName);
        expect(type!.name).to.equal(TypeName.AnyTypeName);
        expect(type!.fullName).to.equal('System.Object');
    });
});

describe('TypeInfoRegistry.composition', () => {
    it('should register the static Instance as type info registry', () => {
        const container = new LiteInjector();
        expect(container.get(TypeInfoRegistry)).to.equal(TypeInfoRegistry.Instance);
    });
});
