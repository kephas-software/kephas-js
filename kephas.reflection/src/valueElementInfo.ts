import {
    ElementInfo, ITypeInfoRegistry, IValueElementInfo, ITypeInfo,
    TypeInfoRegistry, DisplayInfo
} from '.';

/**
 * Reflective element information holding a value.
 *
 * @export
 * @class ValueElementInfo
 * @extends {ElementInfo}
 */
export abstract class ValueElementInfo extends ElementInfo implements IValueElementInfo {
    private _valueType?: ITypeInfo;
    private _valueTypeGetter?: () => ITypeInfo;

    /**
     * Gets the type of the element's value.
     *
     * @type {TypeInfo}
     * @memberof ValueElementInfo
     */
    get valueType(): ITypeInfo {
        return this._valueType || (this._valueType = this._valueTypeGetter!());
    }

    /**
     * Creates an instance of ValueElementInfo.
     *
     * @param {string} name The element name.
     * @param {string} [fullName] Optional. The full name of the element.
     * @param {DisplayInfo} [displayInfo] Optional. The display information.
     * @param {ITypeInfo} [valueType] The value type.
     * @param {ITypeInfoRegistry} [registry] The root type info registry.
     * @memberof ValueElementInfo
     */
    constructor(
        {
            name,
            fullName,
            displayInfo,
            valueType,
            registry,
            ...args
        }: {
            name: string;
            fullName?: string;
            displayInfo?: DisplayInfo;
            valueType?: ITypeInfo | string;
            registry?: ITypeInfoRegistry;
            [key: string]: any;
        }) {
        super({ name, fullName, displayInfo, registry, ...args });
        if (!valueType) {
            this._valueTypeGetter = () => (this._valueType || (this._valueType = this.getValueType('any', registry)));
        }
        else if (typeof valueType === 'string') {
            this._valueTypeGetter = () => (this._valueType || (this._valueType = this.getValueType(valueType as unknown as string, registry)));
        }
        else {
            this._valueType = valueType;
        }
    }

    /**
     * Gets the value type based on the type name.
     *
     * @protected
     * @param {string} valueType The name or full name of the value type.
     * @param {ITypeInfoRegistry} [registry] The type info registry. If not provided, TypeInfoRegistry.Instance will be used.
     * @returns
     * @memberof ValueElementInfo
     */
    protected getValueType(valueType: string, registry?: ITypeInfoRegistry) {
        return (registry || TypeInfoRegistry.Instance).getType(valueType);
    }
}