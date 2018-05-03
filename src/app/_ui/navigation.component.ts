import { Component, ElementRef, Renderer, OnDestroy, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import * as _ from 'lodash';
import { AuthLoginService, MessageService } from '../_services/index';




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})



export class NavigationComponent implements OnDestroy, OnInit {

  isIn = false;
  loggedin: boolean;
  subscription: Subscription;

  trainingmenutitle = '';
  trainingmenu = [];

  exammenutitle = '';
  exammenu = [];

  eventmenutitle = '';
  eventmenu = [];

  maintmenutitle = '';
  maintmenu = [];



    constructor ( private authService: AuthLoginService,
                  private messageService: MessageService) {
      this.subscription = this.messageService
                              .getMessage()
                              .subscribe(message => {
                                  this.initNavMenu(message.roles);
                              });
    }



    ngOnInit() {
      if (this.authService.loggedIn()) {  // If user hits F5 then the nav menu will not disappear
        this.initNavMenu(this.authService.getCurrentUser().role);
      }
    }

    initNavMenu(_roles) {

      if (_roles.length === 0) {
        this.trainingmenutitle = '';
        this.exammenutitle = '';
        this.eventmenutitle = '';
        this.maintmenutitle = '';
        this.trainingmenu = [];
        this.exammenu = [];
        this.eventmenu = [];
        this.maintmenu = [];
      } else {
        this.setNavbarMenuTitles();
        if (_.indexOf(_roles, 'Aikidoka') > -1) {
          this.setAikidokaMenu();
        }
        if (_.indexOf(_roles, 'Instructor') > -1 || _.indexOf(_roles, 'Assistant') > -1) {
          this.setInstructorMenu();
        }
        if (_.indexOf(_roles, 'Dojocho') > -1) {
          this.setDojochoMenu();
        }
      }
    }

    setNavbarMenuTitles() {
        this.trainingmenutitle = 'Edzések';
        this.exammenutitle = 'Vizsgák';
        this.eventmenutitle = 'Események';
        this.maintmenutitle = 'Karbantartás';
    }


    setAikidokaMenu() {
      this.setNavbarMenuTitles();
      this.trainingmenu = _.concat(this.trainingmenu, [{'item': 'Utólagos edzésrögzítés', 'link': 'manreg'},
                                  {'item': 'Edzéstörténet', 'link': 'traininghistory'}]);
      this.exammenu = _.concat(this.exammenu, [{'item': 'Vizsgatörténet', 'link': 'examhistory'},
                              {'item': 'Vizsgajelentkezés', 'link': 'examregistration'}] );
      this.eventmenu = _.concat(this.eventmenu, [{'item': 'Meghirdetett események', 'link': 'events'},
                                {'item': 'Regisztráltak listája', 'link': 'registeredforevent'}] );
      this.maintmenu = _.concat(this.maintmenu, [{'item': 'Jelszóváltoztatás', 'link': 'passwordchange'}]);

    }

    setInstructorMenu() {
      this.trainingmenu = _.concat(this.trainingmenu, [ {'item': 'Edzésrögzítés', 'link': 'qrreg'},
                                    {'item': 'Edzésjóváhagyás', 'link': 'trainingapproval'}]);
    }

    setDojochoMenu() {

      this.exammenu =  _.concat(this.exammenu, [{'item': 'Vizsgaeredmények', 'link': 'examresults'}]);
      this.maintmenu = _.concat(this.maintmenu, [{'item': 'Vizsgák/Események', 'link': 'examevent'},
                                {'item': 'Edzéstervezés', 'link': 'newtraining'},
                                {'item': 'Helyszínek', 'link': 'location'},
                                {'item': 'Előléptetés', 'link': 'rolechange'}]);
    }


  toggleState() { // click handler
      const bool = this.isIn;
      this.isIn = bool === false ? true : false;
  }


  loggedIn() {
    return this.loggedin = this.authService.loggedIn();
  }

  logout () {
      this.authService.logout();
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }


}


