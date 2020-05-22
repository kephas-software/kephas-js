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
    private static _typeNameProperty: string = "$type";
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
        Requires.HasValue(typeName, 'typeName');
        type[Serializable._typeNameProperty] = typeName;
    }

    /**
     * Sets the type namespace for serialization/deserialization purposes.
     * 
     * @static
     * @template T
     * @param {Type<T>} type The type where the type name should be set.
     * @param {string} namespace The type namespace.
     * 
     * @memberOf Serializable
     */
    static setTypeNamespace<T>(type: Type<T>, namespace: string): void {
        type["__namespace"] = namespace;
    }

    /**
     * Gets the type name for serialization/deserialization purposes.
     * 
     * @static
     * @param {Function} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined)} The type name.
     * 
     * @memberOf Serializable
     */
    static getTypeName<T>(typeOrInstance: {} | Type<T>): string | undefined {
        return typeOrInstance[Serializable._typeNameProperty] ?? undefined;
    }

    /**
     * Gets the type namespace for serialization/deserialization purposes.
     * 
     * @static
     * @param {Function} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined)} The type name.
     * 
     * @memberOf Serializable
     */
    static getTypeNamespace<T>(typeOrInstance: {} | Type<T>): string | undefined {
        return typeOrInstance["__namespace"] ?? undefined;
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
        if (!typeName) {
            typeName = type.name;
            const namespace = Serializable.getTypeNamespace(type);
            if (namespace) {
                typeName = `${namespace}.${typeName}`;
            }
        }
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