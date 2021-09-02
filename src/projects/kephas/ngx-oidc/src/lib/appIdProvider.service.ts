import { Injectable } from "@angular/core";

/**
 * This service should be overwritten in the end application
 * to provide the real identity application ID in the getIdentityAppId() method.
 *
 * @export
 * @class AppIdProvider
 */
@Injectable({ providedIn: 'root' })
export class AppIdProvider {
  /**
   * Gets the identity application ID.
   *
   * @returns
   * @memberof AppIdProvider
   */
  getIdentityAppId() {
    return '[TODO-APP-ID]';
  }
}
