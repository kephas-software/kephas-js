import { TypeInfoRegistry } from './typeInfoRegistry';
import { TypeInfo } from './typeInfo';

(<any>TypeInfoRegistry.prototype).initialize = (registry: TypeInfoRegistry) => {
    registry
    .register(new TypeInfo({ name: TypeInfo.AnyTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.BooleanTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.NumberTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.ObjectTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.StringTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.ArrayTypeName, registry }))
    .register(new TypeInfo({ name: TypeInfo.SymbolTypeName, registry }));
}

export * from './displayInfo';
export * from './elementInfo';
export * from './interfaces';
export * from './propertyInfo';
export * from './reflectionError';
export * from './typeInfo';
export * from './typeInfoRegistry';
export * from './valueElementInfo';
