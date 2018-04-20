import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { User, RegData } from '../_models/index';
import { MessageService } from './message.service';



@Injectable()
export class AuthLoginService {


    constructor(private http: HttpClient,
                private messageService: MessageService) { }


    createPerson(user: RegData) {
        return this.http.post('/authlogin/registerperson', user);
    }


    login(username: string, password: string) {
        return this.http.post<User>('/authlogin/authenticate', { username: username, password: password });
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.messageService.clearMessage();
    }

    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser(): User {
        return  JSON.parse(localStorage.getItem('currentUser'));

    }

    loggedIn(): boolean {
        if (localStorage.getItem('currentUser')) {
          // logged in so return true
          return true;
        } else {
           return false;
         }
      }

    isRoleHolder(_role): boolean {

        if (_.findIndex(this.getCurrentUser().role, elem => elem === _role) > -1 ) {
            return true;
        } else {return false; }

    }



}
