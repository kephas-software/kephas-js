import {
    SingletonAppServiceContract, AppServiceContract, AppService, Priority
} from '@kephas/core';
import {
    HttpClient, HttpHandler, HttpXhrBackend, HttpBackend,
    XhrFactory, HttpRequest, HttpEvent, HTTP_INTERCEPTORS, HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injector, StaticClassProvider, Injectable } from '@angular/core';

SingletonAppServiceContract()(XhrFactory);
AppServiceContract()(HttpBackend);
AppServiceContract()(Injector);
AppServiceContract()(HttpXhrBackend);
AppService({ overridePriority: Priority.Low })(HttpXhrBackend);

// tslint:disable: max-classes-per-file

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

/**
 * `HttpHandler` which applies an `HttpInterceptor` to an `HttpRequest`.
 *
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

/**
 * Registry for HTTP client services.
 *
 * @export
 * @class HttpClientAppServiceInfoRegistry
 */
export class HttpClientAppServiceInfoRegistry {

    /**
     * Gets the providers for the HTTP client.
     *
     * @returns {((StaticClassProvider | ExistingProvider)[])}
     * @memberof HttpClientAppServiceInfoRegistry
     */
    public getHttpClientProviders(): (StaticClassProvider)[] {
        return [
            { provide: HttpClient, useClass: HttpClient, deps: [HttpHandler] },
            { provide: HttpHandler, useClass: HttpInterceptingHandler, deps: [HttpBackend, Injector] },
            { provide: HttpBackend, useClass: HttpXhrBackend, deps: [XhrFactory] },
            { provide: XhrFactory, useClass: BrowserXhrFactory, deps: [] },
        ];
    }
}