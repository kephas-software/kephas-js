import { DisplayInfo, ITypeInfoRegistry, ReflectionError, IElementInfo } from '.';

/**
 * Provides basic implementation of reflection elements.
 *
 * @export
 * @class ElementInfo
 */
export abstract class ElementInfo implements IElementInfo {
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
    readonly fullName: string;

    /**
     * Gets the localized display information.
     *
     * @memberof ElementInfo
     */
    readonly displayInfo?: DisplayInfo;

    /**
     * Creates an instance of ElementInfo.
     *
     * @param {string} name The element name.
     * @param {string} [fullName] Optional. The full name of the element.
     * @param {DisplayInfo} [displayInfo] Optional. The display information.
     * @param {ITypeInfoRegistry} [registry] The root type info registry.
     * @memberof ElementInfo
     */
    constructor(
        {
            name,
            fullName,
            displayInfo,
            registry,
            ...args
        }: {
            name: string;
            fullName?: string;
            displayInfo?: DisplayInfo;
            registry?: ITypeInfoRegistry;
            [key: string]: any;
        }) {
        if (!name) {
            throw new ReflectionError('The name must be provided.');
        }

        this.name = name;
        this.fullName = fullName || this.name;
        this.displayInfo = displayInfo || new DisplayInfo();
        Object.assign(this, args);
    }
}
