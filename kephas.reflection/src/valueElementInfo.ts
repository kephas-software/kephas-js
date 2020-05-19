import { ElementInfo } from "./elementInfo";
import { TypeInfo } from "./typeInfo";
import { TypeInfoRegistry } from "./typeInfoRegistry";

/**
 * Contract for reflection elements holding a value.
 *
 * @export
 * @class ValueElementInfo
 * @extends {ElementInfo}
 */
export abstract class ValueElementInfo extends ElementInfo {
    private _valueType?: TypeInfo;
    private _valueTypeGetter?: () => TypeInfo;

    /**
     * Gets the type of the element's value.
     *
     * @type {TypeInfo}
     * @memberof ValueElementInfo
     */
    get valueType(): TypeInfo {
        return this._valueType ?? (this._valueType = this._valueTypeGetter!());
    }

    /**
     * Creates an instance of ValueElementInfo.
     * @param {ValueElementInfo} [info] The The primary data for initializing this instance.
     * @param {TypeInfoRegistry} [registry] The root type info registry.
     * @memberof ValueElementInfo
     */
    constructor(info?: ValueElementInfo, registry?: TypeInfoRegistry) {
        super(info, registry);
        if (info) {
            if (!info.valueType) {
                this._valueTypeGetter = () => (this._valueType ?? (this._valueType = this.getValueType(TypeInfo.AnyTypeName, registry)));
            }
            else if (typeof info.valueType == 'string') {
                this._valueTypeGetter = () => (this._valueType ?? (this._valueType = this.getValueType(<string><unknown>info.valueType, registry)));
            }
            else {
                this._valueType = info.valueType;
            }
        }
        else {
            this._valueTypeGetter = () => (this._valueType ?? (this._valueType = this.getValueType(TypeInfo.AnyTypeName, registry)));
        }
    }

    /**
     * Gets the value type based on the type name.
     *
     * @protected
     * @param {string} valueType The name or full name of the value type.
     * @param {TypeInfoRegistry} [registry] The type info registry. If not provided, TypeInfoRegistry.Instance will be used.
     * @returns
     * @memberof ValueElementInfo
     */
    protected getValueType(valueType: string, registry?: TypeInfoRegistry) {
        return (registry ?? TypeInfoRegistry.Instance).getType(valueType);
    }
}