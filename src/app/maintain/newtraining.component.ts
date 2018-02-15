import { Component, OnInit } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService } from '../_services/index';
import { Options } from '../_models/index';

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

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dpmindate = new Date();
    this.dpmaxdate = new Date();
    this.dpmaxdate.setFullYear(this.dpmindate.getFullYear() + 2);
    this.bsrpConfig = Object.assign({}, {containerClass: 'theme-dark-blue'},
                                        {maxDate: this.dpmaxdate},
                                        {minDate: this.dpmindate},
                                        {dateInputFormat: 'YYYY-MM-DD'},
                                        {showWeekNumbers: false} );
    this.loadDojos();
    this.loadWeekdays();
    this.loadPracticetypes();

  }

 private loadDojos() {
    this.dataService.getdojos()
                    .subscribe( res => {  this.dojos = res; },
                                err => {console.log(err); }  ) ;
  }

  private loadWeekdays() {
    this.dataService.getweekdays()
                    .map(srvresp => srvresp.map(elem => _.extend(elem, {isPracticeDay : false})))
                    .subscribe( mapres => {  this.weekdays = mapres; },
                                err => {console.log(err); }  ) ;
  }

  private loadPracticetypes() {
    this.dataService.getpracticetypes()
                    .subscribe( res => {  this.practicetypes = res; },
                                err => {console.log(err); }  ) ;
  }

  publishPractice() {
    console.log('Meghirdet clicked');
    this.newPractice.weekdayID = [];
    this.newPractice.timerange[1].setHours(this.newPractice.timerange[1].getHours() + 23);
    this.weekdays.forEach(elem => {
      console.log(JSON.stringify(elem));

      if (elem.isPracticeDay) {
        this.newPractice.weekdayID.push(elem.ID);
      }

    });

    this.dataService.addtraining(this.newPractice)
                    .subscribe( res => { console.log(res); },
                                err => {console.log(err); }  ) ;
    console.log(JSON.stringify(this.newPractice.weekdayID));

  }

}
