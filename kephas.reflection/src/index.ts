import { TypeInfoRegistry } from './typeInfoRegistry';
import { TypeInfo } from './typeInfo';

(<any>TypeInfoRegistry.prototype).initialize = (registry: TypeInfoRegistry) => {
    registry.register(
        new TypeInfo({ name: TypeInfo.AnyTypeName, registry }),
        new TypeInfo({ name: TypeInfo.BooleanTypeName, registry }),
        new TypeInfo({ name: TypeInfo.NumberTypeName, registry }),
        new TypeInfo({ name: TypeInfo.ObjectTypeName, registry }),
        new TypeInfo({ name: TypeInfo.StringTypeName, registry }),
        new TypeInfo({ name: TypeInfo.ArrayTypeName, registry }),
        new TypeInfo({ name: TypeInfo.SymbolTypeName, registry }));
}

export * from './displayInfo';
export * from './elementInfo';
export * from './interfaces';
export * from './propertyInfo';
export * from './reflectionError';
export * from './typeInfo';
export * from './typeInfoRegistry';
export * from './valueElementInfo';
