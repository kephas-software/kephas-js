export { DisplayInfo } from './lib/displayInfo';
export { ITypeInfoRegistry, IElementInfo, IValueElementInfo, IPropertyInfo, ITypeInfo } from './lib/interfaces';
export { ReflectionError } from './lib/reflectionError';
export { ElementInfo } from './lib/elementInfo';
export { ValueElementInfo } from './lib/valueElementInfo';
export { PropertyInfo } from './lib/propertyInfo';
export { TypeName } from './lib/typeName';
export { TypeInfo } from './lib/typeInfo';
export { TypeInfoRegistry } from './lib/typeInfoRegistry';

import { TypeInfoRegistry } from './lib/typeInfoRegistry';
import { TypeInfo } from './lib/typeInfo';
import { TypeName } from './lib/typeName';

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

