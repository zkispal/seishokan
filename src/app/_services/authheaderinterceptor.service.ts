import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/index';



@Injectable()
export class AuthHeaderInterceptorService implements HttpInterceptor  {


    exceptions = [
        '/data/getadultranks',
        '/location/getdojos',
        '/authlogin/registerperson',
        '/authlogin/authenticate'
        ];

    token= '';

    constructor () {
        this.loadToken();
    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.exceptions.some(x => x === req.url)) {
            console.log('Excluded request: ' + req.url);
            return next.handle(req);
        } else {
            this.loadToken();
            req = req.clone({
                setHeaders: {
                Authorization: `Bearer ${this.token}`
                }
            });
            console.log('Intercepted request: ' + req.url);
            return next.handle(req);
        }
    }

    loadToken() {
        const currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            this.token = currentUser.token;
        }
    }




}


