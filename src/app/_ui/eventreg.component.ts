import { Component, OnInit, Input, LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import * as differenceInDays from 'date-fns/difference_in_days';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { DataService, AuthLoginService } from '../_services/index';
import { Options, Event } from '../_models/index';

@Component({
  selector: 'app-eventreg',
  templateUrl: './eventreg.component.html',
  styleUrls: ['./eventreg.component.css']
})
export class EventregComponent implements OnInit {

  @Input() list: any[];
  @Input() title: string;
  currentUser;
  userAlreadyRegged: number[] = [];
  regRecord: {eventID: number,
              attendeeID: string,
              attendancetype: string };
  today = new Date();
  locinfo = 'Ez az épület \n Utca, házszám \n IRSZ, Város';



  constructor(private dataService: DataService,
              private authService: AuthLoginService) { }

  ngOnInit() {
    this.regRecord = {eventID: 0,
        attendeeID: '',
        attendancetype: 'Registered' };
    this.currentUser = this.authService.getCurrentUser();
    this.regRecord.attendeeID = this.currentUser.id;
    this. loadAlreadyRegged();
    console.log( 'AttendeeID: ' + this.regRecord.attendeeID);
  }

  register(_id) {
    this.regRecord.eventID = _id;
    this.dataService
        .registerforevent(this.regRecord)
        .subscribe(data => this.userAlreadyRegged.push(_id),
                   err => console.log(err));
  }

  unregister(_id) {
    this.regRecord.eventID = _id;
    this.dataService
        .unregisterfromevent(this.regRecord)
        .subscribe(data => this.userAlreadyRegged.splice(this.userAlreadyRegged.indexOf(_id), 1),
                   err => console.log(err));
  }

  loadAlreadyRegged() {
    this.dataService.getreginfo(this.currentUser.id)
        .map(data => data.map(elem => _.get(elem, 'eventID')))
        .subscribe(data => { this.userAlreadyRegged = data;  console.log( 'data ' + JSON.stringify(data)); }
          , err => console.log(err));

  }



  isRegged(_id): boolean {

      return this.userAlreadyRegged.includes(_id);

  }


  lessThan2Days(_date): boolean {
    return differenceInDays(_date, this.today) < 2;
  }

}
