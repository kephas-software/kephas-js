/**
 * Class decorator for preventing it being specialized.
 *
 * @export
 * @param {Function} ctor The decorated class.
 */
export function Sealed(ctor: Function) {
    Object.freeze(ctor);
    Object.freeze(ctor.prototype);
}