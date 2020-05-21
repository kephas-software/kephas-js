import { Requires } from "../diagnostics/contracts/requires";
import { Type } from "../type";

/**
 * Base class for serializable objects.
 * 
 * @export
 * @abstract
 * @class Serializable
 */
export abstract class Serializable {
    static _typeNameProperty: string = "$type";
    /**
     * Gets or sets the name of the property holding the instance type name.
     *
     * @static
     * @type {string}
     * @memberof Serializable
     */
    static get TypeNameProperty(): string {
        return Serializable._typeNameProperty;
    }

    static set TypeNameProperty(value: string) {
        Requires.HasValue(value, 'value');
        Serializable._typeNameProperty = value;
    }

    /**
     * Sets the type name for serialization/deserialization purposes.
     * 
     * @static
     * @template T
     * @param {Type<T>} type The type where the type name should be set.
     * @param {string} typeName The type name.
     * 
     * @memberOf Serializable
     */
    static setTypeName<T>(type: Type<T>, typeName: string): void {
        (<any>type)[Serializable._typeNameProperty] = typeName;
    }

    /**
     * Gets the type name for serialization/deserialization purposes.
     * 
     * @static
     * @param {Function} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined | null)} The type name.
     * 
     * @memberOf Serializable
     */
    static getTypeName<T>(typeOrInstance: {} | Type<T>): string | undefined | null {
        return (<any>typeOrInstance)[Serializable._typeNameProperty];
    }

    /**
     * Converts the provided object to a JSON representation.
     *
     * @static
     * @param {object} obj The object to be converted.
     * @returns {*} The object containing the JSON representation.
     * @memberof Serializable
     */
    public static getJSON(obj: object): {} {
        let json: object = {};

        let type = obj.constructor;
        let typeName = Serializable.getTypeName(type) || Serializable.getTypeName(obj);
        if (typeName) {
            json[Serializable._typeNameProperty] = typeName;
        }

        Object.keys(obj).forEach(propName => {
            if (!propName.startsWith('_')) {
                json[propName] = obj[propName];
            }
        });

        return json;
    }

    /**
     * Converts the provided object to a string.
     *
     * @static
     * @param {object} obj The object to be converted.
     * @returns {string} The object's string representation.
     * @memberof Serializable
     */
    public static getString(obj: object): string {
        return JSON.stringify(Serializable.getJSON(obj));
    }

    /**
     * Converts this object to a JSON representation.
     * 
     * @returns {{}}
     * 
     * @memberOf Serializable
     */
    public toJSON(): any {
        return Serializable.getJSON(this);
    }

    /**
     * Converts this object to a string.
     * 
     * @returns {string}
     * 
     * @memberOf Serializable
     */
    public toString(): string {
        return JSON.stringify(this.toJSON());
    }
}