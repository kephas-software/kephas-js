import { XhrFactory } from "@angular/common";

/**
 * Browser implementation for an `XhrFactory`.
 *
 * @export
 * @class BrowserXhrFactory
 * @implements {XhrFactory}
 */
 export class BrowserXhrFactory implements XhrFactory {
  build(): XMLHttpRequest {
      return new XMLHttpRequest();
  }
}
