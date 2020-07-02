import { expect } from 'chai';
import 'mocha';

import { TypeInfoRegistry, TypeInfo } from '.';
import { CompositionContext } from '@kephas/core';

describe('TypeInfoRegistry.constructor', () => {
    it('should register the primary types', () => {
        let registry = new TypeInfoRegistry();
        let type = registry.getType(TypeInfo.AnyTypeName)
        expect(type.name).to.equal(TypeInfo.AnyTypeName);
        expect(type.fullName).to.equal(TypeInfo.AnyTypeName);
    });
});

describe('TypeInfoRegistry.composition', () => {
    it('should register the static Instance as type info registry', () => {
        const container = new CompositionContext();
        expect(container.get(TypeInfoRegistry)).to.equal(TypeInfoRegistry.Instance);
    });
});
