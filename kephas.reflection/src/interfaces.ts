import { DisplayInfo } from '.';
import { Type } from '@kephas/core';

/**
 * Registry for types.
 *
 * @export
 * @interface ITypeInfoRegistry
 */
export interface ITypeInfoRegistry {
    /**
     * Gets the type in the registry by its name.
     *
     * @param {string} fullName The full name of the type.
     * @param {boolean} [throwOnNotFound=true] True to throw if the type cannot be found.
     * @returns {TypeInfo}
     * @memberof TypeInfoRegistry
     */
    getType(fullName: string, throwOnNotFound?: boolean): ITypeInfo;
}

/**
 * Provides basic information about reflected information.
 *
 * @export
 * @interface IElementInfo
 */
export interface IElementInfo {
    /**
     * Gets the element name.
     *
     * @type {string}
     * @memberof IElementInfo
     */
    readonly name: string;

    /**
     * Gets the element's full name.
     *
     * @type {string}
     * @memberof IElementInfo
     */
    readonly fullName: string;

    /**
     * Gets the localized display information.
     *
     * @memberof IElementInfo
     */
    readonly displayInfo?: DisplayInfo;

    /**
     * Gets or sets custom values.
     *
     * @memberof IElementInfo
     */
    [key: string]: any;
}

/**
 * Reflective element information holding a value.
 *
 * @export
 * @class ValueElementInfo
 * @extends {ElementInfo}
 */
export interface IValueElementInfo extends IElementInfo {
    /**
     * Gets the type of the element's value.
     *
     * @type {ITypeInfo}
     * @memberof IValueElementInfo
     */
    readonly valueType: ITypeInfo;
}

/**
 * Provides reflective information about a property.
 *
 * @export
 * @class PropertyInfo
 * @extends {ElementInfo}
 * @implements {IPropertyInfo}
 */
export interface IPropertyInfo extends IValueElementInfo {
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
    readonly canWrite: boolean;

    /**
     * Gets a value indicating whether the property value can be read.
     *
     * @type {boolean}
     * @memberof IPropertyInfo
     */
    readonly canRead: boolean;

    /**
     * Gets a value indicating whether a value is required for this property.
     *
     * @type {boolean}
     * @memberof IPropertyInfo
     */
    readonly isRequired: boolean;

    /**
     * Gets the default value of the property.
     *
     * @type {*}
     * @memberof IPropertyInfo
     */
    readonly defaultValue?: any;
}

/**
 * Provides reflective information about a type.
 *
 * @export
 * @class TypeInfo
 * @extends {IElementInfo}
 */
export interface ITypeInfo extends IElementInfo {
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
    readonly properties: IPropertyInfo[];

    /**
     * Gets the instantiable type.
     *
     * @memberof ITypeInfo
     */
    readonly type?: Type<any>;

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
    readonly isBoolean: boolean;

    /**
     * Gets a value indicating whether this type is the number type.
     *
     * @type {boolean} True if the type is the number type, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isNumber: boolean;

    /**
     * Gets a value indicating whether this type is the string type.
     *
     * @type {boolean} True if the type is the string type, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isString: boolean;

    /**
     * Gets a value indicating whether this type is the symbol type.
     *
     * @type {boolean} True if the type is the symbol type, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isSymbol: boolean;

    /**
     * Gets a value indicating whether this type is the any type.
     *
     * @type {boolean} True if the type is the any type, false otherwise.
     * @memberof ITypeInfo
     */
    readonly isAny: boolean;
}
