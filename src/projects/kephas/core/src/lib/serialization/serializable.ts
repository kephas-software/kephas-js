import 'reflect-metadata';
import { Requires } from '../diagnostics/contracts/requires';
import { Expando } from '../expando';
import { AbstractType } from '../type';

/**
 * Base class for serializable objects.
 *
 * @export
 * @abstract
 * @class Serializable
 */
export abstract class Serializable {
    private static _typeFullNameKey: string = '$type';
    private static _typeNamespaceKey: string = 'kephas:namespace';
    /**
     * Gets or sets the name of the key holding the type's full name.
     *
     * @static
     * @type {string}
     * @memberof Serializable
     */
    static get TypeFullNameKey(): string {
        return Serializable._typeFullNameKey;
    }

    static set TypeFullNameKey(value: string) {
        Requires.HasValue(value, 'value');
        Serializable._typeFullNameKey = value;
    }

    /**
     * Sets the type name for serialization/deserialization purposes.
     *
     * @static
     * @template T
     * @param {AbstractType} type The type where the full name should be set.
     * @param {string} typeFullName The type's full name.
     *
     * @memberOf Serializable
     */
    static setTypeFullName(type: AbstractType, typeFullName: string): void {
        Requires.HasValue(typeFullName, 'typeFullName');
        Reflect.defineMetadata(Serializable._typeFullNameKey, typeFullName, type);
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
     * Gets the type's full name for serialization/deserialization purposes.
     *
     * @static
     * @param {{} | AbstractType} typeOrInstance The type from where the type name should be retrieved.
     * @returns {(string | undefined)} The type's full name.
     *
     * @memberOf Serializable
     */
    static getTypeFullName(typeOrInstance: {} | AbstractType): string | undefined {
        if (typeOrInstance instanceof Function) {
            return Reflect.getOwnMetadata(Serializable._typeFullNameKey, typeOrInstance);
        }

        return Reflect.getOwnMetadata(Serializable._typeFullNameKey, typeOrInstance.constructor);
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
        const json: Expando = {};

        const type = obj.constructor;
        let typeName = Serializable.getTypeFullName(type) || Serializable.getTypeFullName(obj);
        if (!typeName) {
            typeName = type.name;
            const namespace = Serializable.getTypeNamespace(type);
            if (namespace) {
                typeName = `${namespace}.${typeName}`;
            }
        }
        if (typeName) {
            json[Serializable._typeFullNameKey] = typeName;
        }

        Object.keys(obj).forEach(propName => {
            if (!propName.startsWith('_') && !propName.startsWith('#')) {
                json[propName] = (obj as Expando)[propName];
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
