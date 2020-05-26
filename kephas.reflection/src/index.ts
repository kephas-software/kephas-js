export { DisplayInfo } from './displayInfo';
export { ITypeInfoRegistry, IElementInfo, IValueElementInfo, IPropertyInfo, ITypeInfo } from './interfaces';
export { ReflectionError } from './reflectionError';
export { ElementInfo } from './elementInfo';
export { ValueElementInfo } from './valueElementInfo';
export { PropertyInfo } from './propertyInfo';
export { TypeInfo } from './typeInfo';
export { TypeInfoRegistry } from './typeInfoRegistry';

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

