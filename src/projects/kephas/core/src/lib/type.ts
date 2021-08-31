/**
 * Declares the primitives of an abstract type.
 *
 * @export
 * @interface AbstractType
 * @extends {Function}
 */
export interface AbstractType extends Function {
    [key: string]: any;
};

/**
 * Declares the primitives of an instantiable type.
 *
 * @export
 * @interface Type
 * @extends {Function}
 * @template T The actual type.
 */
export interface Type<T> extends AbstractType {
    new (...args: any[]): T;
}