import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'apps/client/src/environments/environment';

@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private _auth: AngularFireAuth) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._auth.idToken.pipe(
      switchMap((token) => {
        let apiReq;
        if (token) {
          apiReq = req.clone({
            url: `${environment.apiEndpoint}/${req.url}`,
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          apiReq = req.clone({
            url: `${environment.apiEndpoint}/${req.url}`,
          });
        }
        return next.handle(apiReq);
      })
    );
  }
}
