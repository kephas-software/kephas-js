import { HttpHandler, HttpBackend, HttpRequest, HttpEvent, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injector, Injectable } from '@angular/core';

/**
* `HttpHandler` which applies an `HttpInterceptor` to an `HttpRequest`.
*
*/
export class HttpInterceptorHandler implements HttpHandler {
  constructor(private next: HttpHandler, private interceptor: HttpInterceptor) {
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
      return this.interceptor.intercept(req, this.next);
  }
}

/**
* An injectable `HttpHandler` that applies multiple interceptors
* to a request before passing it to the given `HttpBackend`.
*
* The interceptors are loaded lazily from the injector, to allow
* interceptors to themselves inject classes depending indirectly
* on `HttpInterceptingHandler` itself.
* @see `HttpInterceptor`
*/

@Injectable({ providedIn: 'root' })
export class HttpInterceptingHandler implements HttpHandler {
  private chain: HttpHandler | null = null;

  /**
   * Creates an instance of HttpInterceptingHandler.
   * @param {HttpBackend} backend
   * @param {Injector} injector
   * @memberof HttpInterceptingHandler
   */
  constructor(private backend: HttpBackend, private injector: Injector) {
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if (this.chain === null) {
      const interceptors = this.injector.get(HTTP_INTERCEPTORS, []);
      this.chain = interceptors.reduceRight(
        (next, interceptor) => new HttpInterceptorHandler(next, interceptor), this.backend);
    }
    return this.chain.handle(req);
  }
}
