import { Component, ElementRef, Renderer } from '@angular/core';
import { NgIf } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AuthLoginService } from '../_services/index';




@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})



export class NavigationComponent {

    constructor (private authService: AuthLoginService) {}

    isIn = false;
    loggedin: boolean;

    trainingmenutitle = 'Edzések';
    trainingmenu = [ {'item': 'Edzésrögzítés', 'link': 'qrreg'},
                    {'item': 'Utólagos edzésrögzítés', 'link': 'manreg'},
                    {'item': 'Edzéstörténet', 'link': 'traininghistory'},
                    {'item': 'Edzésjóváhagyás', 'link': 'trainingapproval'}];

    exammenutitle = 'Vizsgák';
    exammenu = [{'item': 'Vizsgatörténet', 'link': 'examhistory'},
                {'item': 'Vizsgajelentkezés', 'link': 'examregistration'},
                {'item': 'Vizsgaeredmények', 'link': 'examresults'}];

    eventmenutitle = 'Események';
    eventmenu = [{'item': 'Meghirdetett események', 'link': 'events'},
                {'item': 'Regisztráltak listája', 'link': 'registeredforevent'}];

    maintmenutitle = 'Karbantartás';
    maintmenu = [{'item': 'Vizsgák/Események', 'link': 'examevent'},
                {'item': 'Edzéstervezés', 'link': 'newtraining'},
                {'item': 'Helyszínek', 'link': 'location'},
                {'item': 'Előléptetés', 'link': 'rolechange'}];


    // store state
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
}


