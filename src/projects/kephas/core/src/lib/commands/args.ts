import { Expando } from "../expando";

/**
 * Arguments used in command line execution.
 *
 * @export
 * @class Args
 * @implements {Expando}
 */
export class Args implements Expando {
    /**
     * Creates an instance of Args.
     * @param {(string | string[] | {})} [args] The arguments.
     * @memberof Args
     */
    constructor(args?: string | string[] | {}) {
        if (typeof args === 'string') {
            this._fillArgsFromString(args, this);
        }
        else if (Array.isArray(args)) {
            this._fillArgsFromStringArray(args, this);
        }
        else if (typeof args === 'object') {
            this._fillArgsFromObject(args, this);
        }
    }

    private _fillArgsFromObject(source: {}, target: Expando): Expando {
        for(let key in source) {
            target[key] = (source as Expando)[key];
        }
        return target;
    }

    private _fillArgsFromString(source: string, target: Expando): Expando {
        var args = source.split(' ').filter(i => i !== '');
        return this._fillArgsFromStringArray(args, target);
    }

    private _fillArgsFromStringArray(source: string[], target: Expando): Expando {
        let key = '';
        let value: any = null;
        let expectedValue = false;

        for (let currentArg of source) {
            var keyStartIndex = 0;

            if (currentArg.startsWith("--")) {
                keyStartIndex = 2;
            }
            else if (currentArg.startsWith("-")) {
                keyStartIndex = 1;
            }
            else if (currentArg.startsWith("/")) {
                // "/SomeSwitch" is equivalent to "--SomeSwitch"
                keyStartIndex = 1;
            }

            // if we received a new argument, but we expected a value, add the previous key with the value "true"
            if (expectedValue) {
                expectedValue = false;

                if (keyStartIndex > 0) {
                    // set the previous key to true and continue with processing the current arg
                    target[key] = true;
                }
                else {
                    target[key] = Args._unescape(currentArg);
                    continue;
                }
            }

            // currentArg starts a new argument
            var separator = currentArg.indexOf('=');

            if (separator >= 0) {
                // currentArg specifies a key with value
                key = Args._unescape(currentArg.substr(keyStartIndex, separator - keyStartIndex));
                value = Args._unescape(currentArg.substr(separator + 1));
            }
            else {
                // currentArg specifies only a key
                // If there is no prefix in current argument, consider it as a key with value "true"
                if (keyStartIndex == 0) {
                    key = Args._unescape(currentArg);
                    value = true;
                }
                else {
                    key = Args._unescape(currentArg.substr(keyStartIndex));
                    expectedValue = true;
                }
            }

            // Override value when key is duplicated. So we always have the last argument win.
            if (!expectedValue) {
                target[key] = value;
            }
        }

        if (expectedValue) {
            target[key] = true;
        }

        return target;
    }

    private static _unescape(value: string): string
    {
        if (value.startsWith("\"") && value.endsWith("\""))
        {
            value = value.substr(1, value.length - 2);
            return value.replace("\\\"", "\"");
        }

        return value;
    }
}
