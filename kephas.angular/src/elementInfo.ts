import { DisplayInfo } from "./displayInfo";
import { TypeInfoRegistry } from "./typeInfoRegistry";
import { ReflectionError } from "./reflectionError";

/**
 * Provides basic implementation of reflection elements.
 * 
 * @export
 * @class ElementInfo
 */
export abstract class ElementInfo implements ElementInfo {
    /**
     * Gets the element name.
     * 
     * @type {string}
     * @memberof IElementInfo
     */
    readonly name: string = '';

    /**
     * Gets the element full name.
     * 
     * @type {string}
     * @memberof ElementInfo
     */
    readonly fullName?: string;

    /**
     * Gets the localized display information.
     *
     * @memberof ElementInfo
     */
    readonly displayInfo?: DisplayInfo;

    /**
     * Creates an instance of ElementInfo.
     * @param {ElementInfo} [info] The primary data for initializing this instance.
     * @param {ElementInfo} [registry] The root type info registry.
     * @memberof ElementInfo
     */
    constructor(info?: ElementInfo, registry?: TypeInfoRegistry) {
        if (info) {
            if (!info.name) {
                throw new ReflectionError("The name must be provided.");
            }

            this.name = info.name;
            this.fullName = info.fullName ?? this.name;
            this.displayInfo = info.displayInfo || new DisplayInfo();
        }
        else {
            this.displayInfo = new DisplayInfo();
        }
    }
}
