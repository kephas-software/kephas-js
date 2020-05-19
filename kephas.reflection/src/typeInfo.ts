import { ElementInfo } from './elementInfo';
import { PropertyInfo } from './propertyInfo';
import { TypeInfoRegistry } from './typeInfoRegistry';

/**
 * Provides reflection information about a type.
 *
 * @export
 * @class TypeInfo
 * @extends {ElementInfo}
 */
export class TypeInfo extends ElementInfo {
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
     * @type {IPropertyInfo[]}
     * @memberof TypeInfo
     */
    readonly properties: PropertyInfo[];

    /**
     * Creates an instance of TypeInfo.
     * @param {TypeInfo} [info] The primary data for the information.
     * @param {TypeInfoRegistry} [registry] The root type info registry.
     * @memberof TypeInfo
     */
    constructor(info?: TypeInfo, registry?: TypeInfoRegistry) {
        super(info, registry);
        if (info) {
            this.namespace = info.namespace;
            this.properties = info.properties?.map(p => new PropertyInfo(this, p, registry)) ?? [];
        }
        else {
            this.properties = [];
        }
    }
}
