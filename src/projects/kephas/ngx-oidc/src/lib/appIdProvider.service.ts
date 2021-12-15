import { AppService, Priority, SingletonAppServiceContract } from "@kephas/core";
import { NgTarget } from "@kephas/ngx-core";

/**
 * This service should be overwritten in the end application
 * to provide the real identity application ID in the getIdentityAppId() method.
 *
 * @export
 * @class AppIdProvider
 */
@AppService({ overridePriority: Priority.Lowest })
@SingletonAppServiceContract({ target: NgTarget })
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
