import { ValueElementInfo } from "./valueElementInfo";
import { TypeInfoRegistry } from "./typeInfoRegistry";
import { TypeInfo } from "./typeInfo";
import { ReflectionError } from "./reflectionError";

/**
 * Provides reflection information about a property.
 *
 * @export
 * @class PropertyInfo
 * @extends {ElementInfo}
 * @implements {IPropertyInfo}
 */
export class PropertyInfo extends ValueElementInfo {

    /**
     * Gets the declaring type.
     *
     * @type {TypeInfo}
     * @memberof PropertyInfo
     */
    readonly declaringType: TypeInfo;

    /**
     * Gets a value indicating whether the property can be written to.
     *
     * @type {boolean}
     * @memberof IPropertyInfo
     */
    readonly canWrite: boolean = true;

    /**
     * Gets a value indicating whether the property value can be read.
     *
     * @type {boolean}
     * @memberof IPropertyInfo
     */
    readonly canRead: boolean = true;

    /**
     * Creates an instance of PropertyInfo.
     * @param {TypeInfo} info The container type.
     * @param {PropertyInfo} info The primary data for the information.
     * @param {TypeInfoRegistry} [registry] The root type info registry.
     * @memberof PropertyInfo
     */
    constructor(type: TypeInfo, info?: PropertyInfo, registry?: TypeInfoRegistry) {
        super(info, registry);

        if (!type) {
            throw new ReflectionError("The declaring type is not set.");
        }

        this.declaringType = type;

        if (info) {
            this.canRead = info.canRead;
            this.canWrite = info.canWrite;
        }
    }
}