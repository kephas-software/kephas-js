import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { from as observableFrom, Observable } from 'rxjs';

import { Notification } from '@kephas/ui';
import { HttpInterceptor } from '../..';

/**
 * See https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8
 *
 * @export
 * @class JwtInterceptorBase
 * @implements {HttpInterceptor}
 */
export abstract class JwtInterceptorBase extends HttpInterceptor {
    /**
     * Creates an instance of JwtInterceptor.
     * @param {Notification} notification The notification service.
     * @memberof JwtInterceptor
     */
    constructor(
        protected notification: Notification) {
        super();
    }

    /**
     * Identifies and handles a given HTTP request.
     * @param req The outgoing request object to handle.
     * @param next The next interceptor in the chain, or the backend
     * if no interceptors remain in the chain.
     * @returns An observable of the event stream.
     */
    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return observableFrom(this._interceptAsync(request, next));
    }

    private async _interceptAsync(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
        try {
            const result = await next.handle(request).toPromise();
            if (result instanceof HttpResponse) {
                // do stuff with response if you want
            }

            return result;
        } catch (err) {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401) {
                    if (await this.tryRefreshTokenAsync(request, err)) {
                        // if second time crashes, let it crash.
                        const result = await next.handle(request).toPromise();
                        return result;
                    }

                    await this.redirectToLoginAsync();
                } else if (err.status === 404) {
                    this.notification.notifyError('Resource not found: ' + err.url);
                }
            }

            throw err;
        }
    }

    /**
     * Tries to refresh the token asynchronously.
     *
     * @protected
     * @param {HttpRequest<any>} request The request.
     * @param {HttpErrorResponse} err The error response.
     * @returns {Promise<boolean>}
     * @memberof JwtInterceptorBase
     */
    protected abstract tryRefreshTokenAsync(request: HttpRequest<any>, err: HttpErrorResponse): Promise<boolean>;

    /**
     * Redirects to the login page asynchronously.
     *
     * @protected
     * @abstract
     * @returns {Promise<any>} The promise.
     * @memberof JwtInterceptorBase
     */
    protected abstract redirectToLoginAsync(): Promise<any>;
}