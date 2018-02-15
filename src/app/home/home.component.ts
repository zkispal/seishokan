import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import {  AuthLoginService } from '../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    currentUser: User;


    constructor(
                private authService: AuthLoginService) {
        this.currentUser = authService.getCurrentUser();
    }

    ngOnInit() {

    }

    logout() {
        this.authService.logout();
    }


}
