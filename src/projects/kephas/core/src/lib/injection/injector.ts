import { InjectionError } from "./injectionError";
import { SingletonAppServiceContract } from "../services/appServiceContract";
import { AbstractType, Type } from "../type";

/**
 * Contract for composition context.
 *
 * @export
 * @abstract
 * @class Injector
 */
@SingletonAppServiceContract()
export abstract class Injector {
  private static _instance: Injector;

  /**
   * Gets or sets the static instance of the Injector.
   *
   * @readonly
   * @static
   * @type {Injector}
   * @memberof Injector
   */
  public static get instance(): Injector {
    return Injector._instance;
  }

  public static set instance(value: Injector) {
    if (value === Injector._instance) {
      return;
    }

    if (value && Injector._instance) {
      throw new InjectionError(`Both the instance (${Injector._instance}) and the new value (${value}) are set. If you really intend to change the injector, set it first to null and then set the new value.`);
    }

    Injector._instance = value;
  }

  /**
     * Gets the service instance of the required service contract type.
     *
     * @template T
     * @param {Type<T>} type The service contract type.
     * @param notFoundResolver A resolver for the case when a type cannot be resolved.
     * @returns {T} The requested service.
     * @memberof Injector
     */
  abstract resolve<T>(type: Type<T> | AbstractType, notFoundResolver?: (type: Type<T> | AbstractType) => any): T;

  /**
   * Gets an array of service instances.
   *
   * @template T
   * @param {Type<T>} type The service contract type.
   * @param notFoundResolver A resolver for the case when a type cannot be resolved.
   * @returns {T[]} The array of the requested service.
   * @memberof Injector
   */
  abstract resolveMany<T>(type: Type<T> | AbstractType, notFoundResolver?: (type: Type<T> | AbstractType) => any): T[];
}
