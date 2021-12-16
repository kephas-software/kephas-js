import { HttpHandler, HttpEvent, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

/**
 * Interceptor handling the authorization.
 *
 * @export
 * @class AuthorizeInterceptor
 * @implements {HttpInterceptor}
 */
@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  /**
   * Creates an instance of AuthorizeInterceptor.
   * @param {AuthenticationService} authorize The authorization service.
   * @memberof AuthorizeInterceptor
   */
  constructor(private authorize: AuthenticationService) {
  }

  /**
   * Intercepts the request.
   *
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {*}  {Observable<HttpEvent<any>>}
   * @memberof AuthorizeInterceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authorize.getAccessToken()
      .pipe(mergeMap(token => this.processRequestWithToken(token, request, next)));
  }

  // Checks if there is an access_token available in the authorize service
  // and adds it to the request in case it's targeted at the same origin as the
  // single page application.
  private processRequestWithToken(token: string | undefined, req: HttpRequest<any>, next: HttpHandler) {
    if (!!token && this.isSameOriginUrl(req)) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }

  private isSameOriginUrl(req: any) {
    // It's an absolute url with the same origin.
    if (req.url.startsWith(`${window.location.origin}/`)) {
      return true;
    }

    // It's a protocol relative url with the same origin.
    // For example: //www.example.com/api/Products
    if (req.url.startsWith(`//${window.location.host}/`)) {
      return true;
    }

    // It's a relative url like /api/Products
    if (/^\/[^\/].*/.test(req.url)) {
      return true;
    }

    // It's an absolute or protocol relative url that
    // doesn't have the same origin.
    return false;
  }
}
