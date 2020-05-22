import { Type } from './type'
import { Serializable } from './serialization/serializable';

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