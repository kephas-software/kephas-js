export { DisplayInfo } from './displayInfo';
export { ITypeInfoRegistry, IElementInfo, IValueElementInfo, IPropertyInfo, ITypeInfo } from './interfaces';
export { ReflectionError } from './reflectionError';
export { ElementInfo } from './elementInfo';
export { ValueElementInfo } from './valueElementInfo';
export { PropertyInfo } from './propertyInfo';
export { TypeName } from './typeName';
export { TypeInfo } from './typeInfo';
export { TypeInfoRegistry } from './typeInfoRegistry';

import { TypeInfoRegistry } from './typeInfoRegistry';
import { TypeInfo } from './typeInfo';
import { TypeName } from './typeName';

(TypeInfoRegistry.prototype as any).initialize = (registry: TypeInfoRegistry) => {
    registry.register(
        new TypeInfo({ name: TypeName.AnyTypeName, fullName: 'System.Object', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.BooleanTypeName, fullName: 'System.Boolean', defaultValue: false, registry }),
        new TypeInfo({ name: TypeName.NumberTypeName, fullName: 'System.Double', defaultValue: 0.0, registry }),
        new TypeInfo({ name: TypeName.StringTypeName, fullName: 'System.String', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.ArrayTypeName, fullName: 'System.Array', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.ArrayOfAnyTypeName, fullName: 'System.Array`1[[System.Object]]', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.ArrayOfByteTypeName, fullName: 'System.Array`1[[System.Byte]]', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.SymbolTypeName, fullName: 'System.Symbol', defaultValue: null, registry }),
        new TypeInfo({ name: TypeName.DateTypeName, fullName: 'System.DateTime', defaultValue: null, registry }));
}

