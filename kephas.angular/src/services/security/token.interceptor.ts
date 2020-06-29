import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenService, HttpInterceptor } from '../..';
import { AppService } from '@kephas/core';


/**
 * Interceptor for setting the token in HTTP calls.
 *
 * @export
 * @class TokenInterceptor
 * @implements {HttpInterceptor}
 */
@AppService()
export class TokenInterceptor extends HttpInterceptor {

    /**
     * Creates an instance of TokenInterceptor.
     * @param {TokenService} tokenService The token service.
     * @memberof TokenInterceptor
     */
    constructor(public tokenService: TokenService) {
        super();
    }

    /**
     * Identifies and handles a given HTTP request.
     * @param {HttpRequest<any>} request The outgoing request object to handle.
     * @param {HttpHandler} next The next interceptor in the chain, or the backend
     * if no interceptors remain in the chain.
     * @returns {Observable<HttpEvent<any>>} An observable of the event stream.
     * @memberof TokenInterceptor
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenService.token;
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                }
            });
        }
        return next.handle(request);
    }
}
