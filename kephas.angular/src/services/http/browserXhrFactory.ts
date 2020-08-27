import { AppService, Priority } from '@kephas/core';
import { XhrFactory } from '@angular/common/http';

/**
 * A factory for `HttpXhrBackend` that uses the `XMLHttpRequest` browser API.
 *
 */
@AppService({ overridePriority: Priority.Low })
export class BrowserXhrFactory extends XhrFactory {
  build(): XMLHttpRequest {
    return new XMLHttpRequest();
  }
}
