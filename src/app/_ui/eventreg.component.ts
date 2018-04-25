import { Component, OnInit, Input, LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import * as differenceInDays from 'date-fns/difference_in_days';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
import { Options, Event } from '../_models/index';

@Component({
  selector: 'app-eventreg',
  templateUrl: './eventreg.component.html',
  styleUrls: ['./eventreg.component.css']
})
export class EventregComponent implements OnInit {

  @Input() list: any[];
  @Input() title: string;

  userAlreadyRegged: number[] = [];
  regRecord: {eventID: number,
              attendeeID: string,
              attendancetype: string };
  today = new Date();
  // locinfo = 'Ez az épület \n Utca, házszám \n IRSZ, Város';



  constructor(private dataService: DataService,
              private authService: AuthLoginService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.regRecord = {eventID: 0,
        attendeeID: '',
        attendancetype: 'Registered' };
    this.regRecord.attendeeID = this.authService.getCurrentUser().ID;
    this.loadAlreadyRegged();

  }

  loadAlreadyRegged() {
    this.dataService.getreginfo(this.authService.getCurrentUser().ID)
        .map(data => data.map(elem => _.get(elem, 'eventID')))
        .subscribe(data => { this.userAlreadyRegged = data;  }
          , err => this.alertService.error('Korábbi regisztrációk letöltése sikertelen! ' + err.message));
  }


  register(_id) {
    this.regRecord.eventID = _id;
    this.dataService
        .registerforevent(this.regRecord)
        .subscribe(data => this.userAlreadyRegged.push(_id),
                   err => this.alertService.error('Sikertelen regisztráció. ' + err.message));
  }

  unregister(_id) {
    this.regRecord.eventID = _id;
    this.dataService
        .unregisterfromevent(this.regRecord)
        .subscribe(data => this.userAlreadyRegged.splice(this.userAlreadyRegged.indexOf(_id), 1),
                   err => this.alertService.error('Sikertelen lejelentkezés. ' + err.message));
  }





  isRegged(_id): boolean {

      return this.userAlreadyRegged.includes(_id);

  }


  lessThan2Days(_date): boolean {
    return differenceInDays(_date, this.today) < 2;
  }

}
