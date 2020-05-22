import { ValueElementInfo } from "./valueElementInfo";
import { ITypeInfoRegistry, ITypeInfo, IPropertyInfo } from "./interfaces";
import { ReflectionError } from "./reflectionError";
import { DisplayInfo } from "./displayInfo";

/**
 * Provides reflection information about a property.
 *
 * @export
 * @class PropertyInfo
 * @extends {ElementInfo}
 * @implements {IPropertyInfo}
 */
export class PropertyInfo extends ValueElementInfo implements IPropertyInfo {

    /**
     * Gets the declaring type.
     *
     * @type {TypeInfo}
     * @memberof PropertyInfo
     */
    readonly declaringType: ITypeInfo;

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
     * Gets a value indicating whether a value is required for this property.
     *
     * @type {boolean}
     * @memberof PropertyInfo
     */
    readonly isRequired: boolean = false;

    /**
     * Gets the default value of the property.
     *
     * @type {*}
     * @memberof PropertyInfo
     */
    readonly defaultValue?: any;

    /**
     * Creates an instance of PropertyInfo.
     * 
     * @param {ITypeInfo} declaringType The declaring type.
     * @param {string} name The element name.
     * @param {string} [fullName] Optional. The full name of the element.
     * @param {DisplayInfo} [displayInfo] Optional. The display information.
     * @param {ITypeInfo} [valueType] The value type.
     * @param {boolean} [canRead] True if the property can be read.
     * @param {boolean} [canWrite] True if the property can be written.
     * @param {boolean} [isRequired] True if the property requires a value to be set.
     * @param {*} [defaultValue] The default value of the property.
     * @param {ITypeInfoRegistry} [registry] The root type info registry.
     * @memberof PropertyInfo
     */
    constructor(
        {
            declaringType,
            name,
            fullName,
            displayInfo,
            valueType,
            canRead,
            canWrite,
            isRequired,
            defaultValue,
            registry,
            ...args
        }: {
            declaringType: ITypeInfo;
            name: string;
            fullName?: string;
            displayInfo?: DisplayInfo;
            valueType?: ITypeInfo | string;
            canRead?: boolean;
            canWrite?: boolean;
            isRequired?: boolean;
            defaultValue?: any;
            registry?: ITypeInfoRegistry;
            [key: string]: any;
        }) {
        super({ name, fullName, displayInfo, valueType, registry, ...args });

        if (!declaringType) {
            throw new ReflectionError("The declaring type is not set.");
        }

        this.declaringType = declaringType;
        this.canRead = canRead == undefined ? true : canRead;
        this.canWrite = canWrite == undefined ? true : canWrite;
        this.isRequired = !!isRequired;
        this.defaultValue = defaultValue;
    }
}