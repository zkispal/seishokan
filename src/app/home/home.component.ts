import { Component, OnInit } from '@angular/core';
import { User } from '../_models/index';
import {  AuthLoginService, MessageService} from '../_services/index';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
    currentUser: User;


    constructor(private authService: AuthLoginService,
                private messageService: MessageService) {

    }


    ngOnInit() {
        this.currentUser = this.authService.getCurrentUser();
/*         this.messageService.clearMessage();
        this.messageService.sendMessage(this.currentUser.role); */
    }


    logout() {
        this.authService.logout();
    }

}
