import { Component, OnInit } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AlertService } from '../_services/index';
import { Options } from '../_models/index';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-newtraining',
  templateUrl: './newtraining.component.html',
  styleUrls: ['./newtraining.component.css']
})
export class NewtrainingComponent implements OnInit {

  dojos: Options[];
  practicetypes: Options[];
  weekdays: Array<any>;
  ngselectmodel = {ID: 'id', name: 'text'};
  newPractice = {timerange: [new Date(), new Date()],
                 eventtypeID: 0,
                 locationID: 0,
                 weekdayID: [],
                 practicelength: 0};

  bsrpConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;
  locale = 'hu';

  constructor(private dataService: DataService,
              private bsLocService: BsLocaleService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.dpmindate = new Date();
    this.dpmaxdate = new Date();
    this.dpmaxdate.setFullYear(this.dpmindate.getFullYear() + 2);
    this.bsLocService.use(this.locale);
    this.bsrpConfig = Object.assign({}, {containerClass: 'theme-dark-blue'},
                                        {maxDate: this.dpmaxdate},
                                        {minDate: this.dpmindate},
                                        {dateInputFormat: 'YYYY-MMM-DD'},
                                        {showWeekNumbers: false} );
    this.loadDojos();
    this.loadWeekdays();
    this.loadPracticetypes();

  }

 private loadDojos() {
    this.dataService
        .getdojos()
        .subscribe( res => { this.dojos = res; },
                    err => { this.alertService.error('Dojolista betöltése sikertelen! ' + err.message); }  ) ;
  }

  private loadWeekdays() {
    this.dataService
        .getweekdays()
        .map(srvresp => srvresp.map(elem => _.extend(elem, {isPracticeDay : false})))
        .subscribe( mapres => {  this.weekdays = mapres; },
                    err => { this.alertService.error('Napok listájának betöltése sikertelen! ' + err.message); }  ) ;
  }

  private loadPracticetypes() {
    this.dataService
        .getpracticetypes()
        .subscribe( res => {  this.practicetypes = res; },
                    err => {this.alertService.error('Edzéstípusok betöltése sikertelen! ' + err.message); }  ) ;
  }

  publishPractice() {
    this.newPractice.weekdayID = [];
    this.newPractice.timerange[1].setHours(this.newPractice.timerange[1].getHours() + 23);

    this.weekdays.forEach(elem => {
      if (elem.isPracticeDay) {
        this.newPractice.weekdayID.push(elem.ID);
      }

    });

    this.dataService.addtraining(this.newPractice)
                    .subscribe( res => {this.alertService.success('Sikeres edzésmeghirdtés.'); },
                                err => {console.log(JSON.stringify(err));

                                  this.alertService.error('Sikertelen edzésmeghirdetés ' + err.error.message + ' ' + err.message); }  ) ;
  }

}
