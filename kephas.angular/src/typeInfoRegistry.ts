import { TypeInfo } from "./typeInfo";
import { ReflectionError } from "./reflectionError";
import { Requires } from "@kephas/core";

/**
 * Provides centralized access to the application's type system.
 *
 * @export
 * @class TypeInfoRegistry
 */
export class TypeInfoRegistry {
    /**
     * Gets the registerd types.
     *
     * @type {TypeInfo[]}
     * @memberof TypeSystem
     */
    readonly types: TypeInfo[];

    /**
     * Gets the singleton instance of the type system.
     *
     * @static
     * @type {TypeInfoRegistry}
     * @memberof TypeSystem
     */
    static Instance: TypeInfoRegistry = new TypeInfoRegistry();

    private _typesByFullName: { [key: string]: TypeInfo } = {}

    /**
     * Creates an instance of TypeInfoRegistry.
     * @memberof TypeInfoRegistry
     */
    constructor() {
        // super();
        this.types = [];

        this
            .register(new TypeInfo({ name: TypeInfo.AnyTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.BooleanTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.NumberTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.ObjectTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.StringTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.ArrayTypeName, properties: [] }, this))
            .register(new TypeInfo({ name: TypeInfo.SymbolTypeName, properties: [] }, this));
    }

    /**
     * Gets the type in the registry by its name.
     *
     * @param {string} fullName The full name of the type.
     * @param {boolean} [throwOnNotFound=true] True to throw if an 
     * @returns {TypeInfo}
     * @memberof TypeInfoRegistry
     */
    public getType(fullName: string, throwOnNotFound: boolean = true): TypeInfo {
        Requires.HasValue(fullName, 'fullName');

        const type = this._typesByFullName[fullName];
        if(!type && throwOnNotFound) {
            throw new ReflectionError(`The type with name '${fullName}' was not found.`);
        }

        return type;
    }

    /**
     * Registers a new type in the type system.
     *
     * @param {ITypeInfo} type
     * @returns {this}
     * @memberof TypeSystem
     */
    public register(type: TypeInfo): this {
        if (!type) {
            throw new ReflectionError("The type must be provided.");
        }

        const typeKey = type.fullName ?? type.name;
        if (this._typesByFullName[type.fullName ?? type.name]) {
            throw new ReflectionError(`The type ${typeKey} is already registered.`);
        }

        this._typesByFullName[typeKey] = type;
        this.types.push(type);

        return this;
    }
}