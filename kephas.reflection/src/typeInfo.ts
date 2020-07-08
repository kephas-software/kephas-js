import {
    ElementInfo, PropertyInfo, ITypeInfo, ITypeInfoRegistry,
    IPropertyInfo, DisplayInfo, ReflectionError
} from '.';
import { Serializable, Type } from '@kephas/core';

/**
 * Provides reflective information about a type.
 *
 * @export
 * @class TypeInfo
 * @extends {ElementInfo}
 */
export class TypeInfo extends ElementInfo implements ITypeInfo {
    /**
     * The name of the 'any' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly AnyTypeName = 'any';

    /**
     * The name of the 'object' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly ObjectTypeName = 'object';

    /**
     * The name of the 'boolean' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly BooleanTypeName = 'boolean';

    /**
     * The name of the 'number' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly NumberTypeName = 'number';

    /**
     * The name of the 'string' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly StringTypeName = 'string';

    /**
     * The name of the 'array' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly ArrayTypeName = 'array';

    /**
     * The name of the 'symbol' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly SymbolTypeName = 'symbol';

    /**
     * The name of the 'Date' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly DateTypeName = 'Date';

    /**
     * Gets the type's namespace.
     *
     * @type {string}
     * @memberof TypeInfo
     */
    readonly namespace?: string;

    /**
     * Gets the type's properties.
     *
     * @type {IIPropertyInfo[]}
     * @memberof TypeInfo
     */
    readonly properties: IPropertyInfo[];

    /**
     * Gets the instance constructor.
     *
     * @memberof ITypeInfo
     */
    readonly type?: Type<any>;

    /**
     * Gets a value indicating whether this type is an array.
     *
     * @type {boolean} True if the type is an array, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isArray: boolean;

    /**
     * Gets a value indicating whether this type is an enumeration.
     *
     * @type {boolean} True if the type is an enumeration, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isEnum: boolean;

    /**
     * Gets a value indicating whether this type is the boolean type.
     *
     * @type {boolean} True if the type is the boolean type, false otherwise.
     * @memberof ITypeInfo
     */
    get isBoolean(): boolean {
        return this.fullName === TypeInfo.BooleanTypeName;
    }

    /**
     * Gets a value indicating whether this type is the number type.
     *
     * @type {boolean} True if the type is the number type, false otherwise.
     * @memberof ITypeInfo
     */
    get isNumber(): boolean {
        return this.fullName === TypeInfo.NumberTypeName;
    }

    /**
     * Gets a value indicating whether this type is the string type.
     *
     * @type {boolean} True if the type is the string type, false otherwise.
     * @memberof ITypeInfo
     */
    get isString(): boolean {
        return this.fullName === TypeInfo.StringTypeName;
    }

    /**
     * Gets a value indicating whether this type is the symbol type.
     *
     * @type {boolean} True if the type is the symbol type, false otherwise.
     * @memberof ITypeInfo
     */
    get isSymbol(): boolean {
        return this.fullName === TypeInfo.SymbolTypeName;
    }

    /**
     * Gets a value indicating whether this type is the any type.
     *
     * @type {boolean} True if the type is the any type, false otherwise.
     * @memberof ITypeInfo
     */
    get isAny(): boolean {
        return this.fullName === TypeInfo.AnyTypeName;
    }

    /**
     * Creates an instance of TypeInfo.
     *
     * @param {string} name The type name.
     * @param {string} [namespace] The type namespace.
     * @param {string} [fullName] Optional. The full name of the type.
     * @param {DisplayInfo} [displayInfo] Optional. The display information.
     * @param {IPropertyInfo[]} [properties] Optional. The properties.
     * @param {Type<*>} [type] Optional. The instantiable type.
     * @param {boolean} [isEnum] Optional. Indicates whether the type is an enumeration.
     * @param {boolean} [isArray] Optional. Indicates whether the type is an array.
     * @param {ITypeInfoRegistry} [registry] The root type info registry.
     * @memberof TypeInfo
     */
    constructor(
        {
            name,
            namespace,
            fullName,
            displayInfo,
            properties,
            type,
            isArray,
            isEnum,
            registry,
            ...args
        }: {
            name?: string;
            namespace?: string;
            fullName?: string;
            displayInfo?: DisplayInfo;
            properties?: {
                name: string;
                fullName?: string;
                displayInfo?: DisplayInfo;
                valueType?: ITypeInfo | string;
                canRead?: boolean;
                canWrite?: boolean;
                isRequired?: boolean;
                isStatic?: boolean;
                defaultValue?: any;
                [key: string]: any;
            }[];
            type?: Type<any>;
            isArray?: boolean;
            isEnum?: boolean;
            registry?: ITypeInfoRegistry;
            [key: string]: any;
        }) {
        super({
            name: TypeInfo._getName(name, type),
            fullName: fullName || TypeInfo._getFullName(name, namespace, type),
            displayInfo,
            registry,
            ...args
        });
        this.type = type;
        this.namespace = TypeInfo._getNamespace(namespace, type);
        properties = properties && properties.map(p => new PropertyInfo({ ...p, declaringType: this, registry }));
        this.properties = (properties || []) as IPropertyInfo[];
        if (this.type) {
            Serializable.setTypeFullName(this.type, this.fullName);
        }
        this.isEnum = !!isEnum;
        this.isArray = !!isArray;
    }

    private static _getName(name?: string, type?: Type<any>): string {
        if (name) {
            return name;
        }

        if (type) {
            return type.name;
        }

        throw new ReflectionError('Either the name or the type name should be provided.');
    }

    private static _getFullName(name?: string, namespace?: string, type?: Type<any>): string {
        name = TypeInfo._getName(name, type);
        namespace = TypeInfo._getNamespace(namespace, type);
        return namespace ? `${namespace}.${name}` : name;
    }

    private static _getNamespace(namespace?: string, type?: Type<any>): string | undefined {
        return namespace || (type ? Serializable.getTypeNamespace(type) : undefined);
    }
}
