import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
    constructor() { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('token') != null) {
            const token = localStorage.getItem('token');
            // if the token is  stored in localstorage add it to http header
            const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
            // clone http to the custom AuthRequest and send it to the server
            const AuthRequest = request.clone({ headers: headers });
            return next.handle(AuthRequest);
        } else {
            return next.handle(request);
        }
    }
}
