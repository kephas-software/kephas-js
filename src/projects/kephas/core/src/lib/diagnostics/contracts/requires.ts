import { ArgumentError } from "../../argumentError";

/**
 * Provides contract checks.
 *
 * @export
 * @class Requires
 */
export class Requires {
    /**
     * Requires that the argument has a value (not null or undefined or empty).
     *
     * @static
     * @param {*} value
     * @param {string} name
     * @memberof Requires
     */
    public static HasValue(value: any, name: string) {
        if (!value) {
            throw new ArgumentError(`The argument '${name}' is not set.`, name);
        }
    }
}
