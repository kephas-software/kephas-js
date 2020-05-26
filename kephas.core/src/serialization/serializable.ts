import { Requires } from "..";
import { AbstractType } from "..";
import "reflect-metadata";

/**
 * Base class for serializable objects.
 * 
 * @export
 * @abstract
 * @class Serializable
 */
export abstract class Serializable {
    private static _typeNameKey: string = "$type";
    private static _typeNamespaceKey: string = "kephas:namespace";
    /**
     * Gets or sets the name of the property holding the instance type name.
     *
     * @static
     * @type {string}
     * @memberof Serializable
     */
    static get TypeNameProperty(): string {
        return Serializable._typeNameKey;
    }

    static set TypeNameProperty(value: string) {
        Requires.HasValue(value, 'value');
        Serializable._typeNameKey = value;
    }

    /**
     * Sets the type name for serialization/deserialization purposes.
     * 
     * @static
     * @template T
     * @param {AbstractType} type The type where the type name should be set.
     * @param {string} typeName The type name.
     * 
     * @memberOf Serializable
     */
    static setTypeName(type: AbstractType, typeName: string): void {
        Requires.HasValue(typeName, 'typeName');
        Reflect.defineMetadata(Serializable._typeNameKey, typeName, type);
    }

    /**
     * Sets the type namespace for serialization/deserialization purposes.
     * 
     * @static
     * @template T
     * @param {AbstractType} type The type where the type name should be set.
     * @param {string} namespace The type namespace.
     * 
     * @memberOf Serializable
     */
    static setTypeNamespace(type: AbstractType, namespace: string): void {
        Reflect.defineMetadata(Serializable._typeNamespaceKey, namespace, type);
    }

    /**
     * Gets the type name for serialization/deserialization purposes.
     * 
     * @static
     * @param {{} | AbstractType} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined)} The type name.
     * 
     * @memberOf Serializable
     */
    static getTypeName(typeOrInstance: {} | AbstractType): string | undefined {
        if (typeOrInstance instanceof Function) {
            return Reflect.getOwnMetadata(Serializable._typeNameKey, typeOrInstance);
        }

        return Reflect.getOwnMetadata(Serializable._typeNameKey, typeOrInstance.constructor);
    }

    /**
     * Gets the type namespace for serialization/deserialization purposes.
     * 
     * @static
     * @param {AbstractType} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined)} The type name.
     * 
     * @memberOf Serializable
     */
    static getTypeNamespace(typeOrInstance: AbstractType): string | undefined {
        return Reflect.getOwnMetadata(Serializable._typeNamespaceKey, typeOrInstance);
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
            json[Serializable._typeNameKey] = typeName;
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