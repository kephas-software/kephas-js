import { ElementInfo } from './elementInfo';
import { PropertyInfo } from './propertyInfo';
import { ITypeInfoRegistry, ITypeInfo, IPropertyInfo } from './interfaces';
import { DisplayInfo } from './displayInfo';

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
    static readonly AnyTypeName = "any";

    /**
     * The name of the 'object' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly ObjectTypeName = "object";

    /**
     * The name of the 'boolean' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly BooleanTypeName = "boolean";

    /**
     * The name of the 'number' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly NumberTypeName = "number";

    /**
     * The name of the 'string' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly StringTypeName = "string";

    /**
     * The name of the 'array' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly ArrayTypeName = "array";

    /**
     * The name of the 'symbol' type.
     *
     * @static
     * @memberof TypeInfo
     */
    static readonly SymbolTypeName = "symbol";

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
        return this.fullName == TypeInfo.BooleanTypeName;
    }

    /**
     * Gets a value indicating whether this type is the number type.
     *
     * @type {boolean} True if the type is the number type, false otherwise.
     * @memberof ITypeInfo
     */
    get isNumber(): boolean {
        return this.fullName == TypeInfo.NumberTypeName;
    }

    /**
     * Gets a value indicating whether this type is the string type.
     *
     * @type {boolean} True if the type is the string type, false otherwise.
     * @memberof ITypeInfo
     */
    get isString(): boolean {
        return this.fullName == TypeInfo.StringTypeName;
    }

    /**
     * Gets a value indicating whether this type is the symbol type.
     *
     * @type {boolean} True if the type is the symbol type, false otherwise.
     * @memberof ITypeInfo
     */
    get isSymbol(): boolean {
        return this.fullName == TypeInfo.SymbolTypeName;
    }

    /**
     * Gets a value indicating whether this type is the any type.
     *
     * @type {boolean} True if the type is the any type, false otherwise.
     * @memberof ITypeInfo
     */
    get isAny(): boolean {
        return this.fullName == TypeInfo.AnyTypeName;
    }

    /**
     * Creates an instance of TypeInfo.
    * 
    * @param {string} name The type name.
    * @param {string} [namespace] The type namespace.
    * @param {string} [fullName] Optional. The full name of the type.
    * @param {DisplayInfo} [displayInfo] Optional. The display information.
    * @param {IPropertyInfo[]} [properties] Optional. The properties.
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
            isArray,
            isEnum,
            registry,
        }: {
            name: string;
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
            }[];
            isArray?: boolean;
            isEnum?: boolean;
            registry?: ITypeInfoRegistry;
        }) {
        super({ name, fullName, displayInfo, registry });
        this.namespace = namespace;
        this.properties = properties?.map(p => new PropertyInfo({ ...p, declaringType: this, registry })) ?? [];
        this.isEnum = !!isEnum;
        this.isArray = !!isArray;
    }
}
