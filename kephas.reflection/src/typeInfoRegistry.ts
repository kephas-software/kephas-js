import { ReflectionError, ITypeInfoRegistry, ITypeInfo, TypeName } from '.';
import { Requires, SingletonAppServiceContract, AppService, Priority, Serializable } from '@kephas/core';

/**
 * Provides centralized access to the application's type system.
 *
 * @export
 * @class TypeInfoRegistry
 */
@AppService({ overridePriority: Priority.Low, provider: _ => TypeInfoRegistry.Instance })
@SingletonAppServiceContract()
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
    static get Instance(): ITypeInfoRegistry {
        return TypeInfoRegistry._instance || (TypeInfoRegistry._instance = new TypeInfoRegistry());
    }

    private static _instance: ITypeInfoRegistry;
    private _typesByFullName: { [key: string]: ITypeInfo } = {}
    private _typesByName: { [key: string]: ITypeInfo } = {}

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
     * @param {string | Function} typeRef The full name of the type or the runtime type.
     * @param {boolean} [throwOnNotFound=true] True to throw if the type cannot be found.
     * @returns {TypeInfo}
     * @memberof TypeInfoRegistry
     */
    public getType(typeRef: string | Function, throwOnNotFound?: boolean): ITypeInfo | undefined {
        Requires.HasValue(typeRef, 'typeRef');
        if (throwOnNotFound === undefined) {
            throwOnNotFound = true;
        }

        let fullName = typeof typeRef === 'function'
            ? Serializable.getTypeFullName(typeRef)
            : typeRef;
        if (fullName && fullName.endsWith('[]')) {
            fullName = TypeName.ArrayOfAnyTypeName;
        }

        let type = fullName ? this._typesByFullName[fullName] : undefined;
        if (!type && fullName) {
            type = this._typesByName[fullName];
        }

        if (!type && throwOnNotFound) {
            throw new ReflectionError(`The type with name '${typeRef}' was not found.`);
        }

        return type;
    }

    /**
     * Registers the provided types.
     *
     * @param {ITypeInfo[]} types The types to register.
     * @returns {this} This registry.
     * @memberof TypeInfoRegistry
     */
    public register(...types: ITypeInfo[]): this {
        if (!types) {
            return this;
        }

        for (const type of types) {
            const typeKey = type.fullName || type.name;
            if (this._typesByFullName[typeKey]) {
                throw new ReflectionError(`The type ${typeKey} is already registered.`);
            }

            this._typesByFullName[typeKey] = type;
            this._typesByName[type.name] = type;
        }

        this.types.push.apply(this.types, types);

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