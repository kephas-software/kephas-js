import { HttpInterceptor as AngularHttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { SingletonAppServiceContract } from '@kephas/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgTarget } from '../../angularTarget';

/**
 * Base class for HTTP interceptors.
 *
 * @export
 * @extends {AngularHttpInterceptor}
 */
@SingletonAppServiceContract({ allowMultiple: true, contractToken: HTTP_INTERCEPTORS, target: NgTarget })
export abstract class HttpInterceptor implements AngularHttpInterceptor {
    /**
     * Identifies and handles a given HTTP request.
     * @param req The outgoing request object to handle.
     * @param next The next interceptor in the chain, or the backend
     * if no interceptors remain in the chain.
     * @returns An observable of the event stream.
     */
    public abstract intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
