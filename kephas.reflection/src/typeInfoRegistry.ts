import { ReflectionError } from "./reflectionError";
import { Requires } from "@kephas/core";
import { ITypeInfoRegistry, ITypeInfo } from "./interfaces";

/**
 * Provides centralized access to the application's type system.
 *
 * @export
 * @class TypeInfoRegistry
 */
export class TypeInfoRegistry implements ITypeInfoRegistry {
    /**
     * Gets the registerd types.
     *
     * @type {ITypeInfo[]}
     * @memberof TypeInfoRegistry
     */
    readonly types: ITypeInfo[] = [];

    /**
     * Gets the singleton instance of the type registry.
     *
     * @static
     * @type {TypeInfoRegistry}
     * @memberof TypeInfoRegistry
     */
    static get Instance(): ITypeInfoRegistry{
        return TypeInfoRegistry._instance ?? (TypeInfoRegistry._instance = new TypeInfoRegistry());
    }

    private static _instance: ITypeInfoRegistry;
    private _typesByFullName: { [key: string]: ITypeInfo } = {}

    /**
     * Creates an instance of TypeInfoRegistry.
     * @memberof TypeInfoRegistry
     */
    constructor() {
        this.types = [];
        this.initialize(this);
    }

    /**
     * Gets the type in the registry by its name.
     *
     * @param {string} fullName The full name of the type.
     * @param {boolean} [throwOnNotFound=true] True to throw if the type cannot be found.
     * @returns {TypeInfo}
     * @memberof TypeInfoRegistry
     */
    public getType(fullName: string, throwOnNotFound?: boolean): ITypeInfo {
        Requires.HasValue(fullName, 'fullName');
        if (throwOnNotFound == undefined) {
            throwOnNotFound = true;
        }

        const type = this._typesByFullName[fullName];
        if (!type && throwOnNotFound) {
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
    public register(type: ITypeInfo): this {
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

    /**
     * Initializes the registry.
     *
     * @protected
     * @param {TypeInfoRegistry} registry
     * @memberof TypeInfoRegistry
     */
    protected initialize(registry: TypeInfoRegistry) {
    }
}