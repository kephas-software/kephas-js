import { Serializable } from "./serialization/serializable";
import { Type } from "./type";

/**
 * Class decorator for annotating the namespace of a class.
 *
 * @export
 * @param {Function} ctor The decorated class.
 */
export function Namespace(namespace: string) {
    return (type: Type<any>) => {
        Serializable.setTypeNamespace(type, namespace);
    };
}

/**
 * Class decorator for annotating the full name of a class.
 *
 * @export
 * @param {Function} ctor The decorated class.
 */
export function FullName(fullName: string) {
    return (type: Type<any>) => {
        Serializable.setTypeFullName(type, fullName);
    };
}
