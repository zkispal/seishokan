import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import * as _ from 'lodash';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
import 'rxjs/add/operator/toPromise';







@Component({
  selector: 'app-traininghistory',
  templateUrl: './traininghistory.component.html',
  styleUrls: ['./traininghistory.component.css']
})
export class TraininghistoryComponent implements OnInit {

  bsrpConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;
   timerange: Date[] = [];

  traininghistory = [];
  pagedHistory = [];
  itemsPerPage = 10;
  loaded = false;




  constructor (private dataService: DataService,
               private authService: AuthLoginService,
               private cdRef: ChangeDetectorRef,
               private alertService: AlertService ) {

  }

  ngOnInit() {
    this.timerange[1] = new Date();
    this.timerange[0] = new Date();
    this.timerange[0].setMonth(this.timerange[1].getMonth() - 2);

    this.dpmindate = new Date(1970, 1, 1, 0, 0, 0);
    this.dpmaxdate = new Date();
    this.bsrpConfig = Object.assign({}, {containerClass: 'theme-dark-blue'},
                                        {maxDate: this.dpmaxdate},
                                        {minDate: this.dpmindate},
                                        {dateInputFormat: 'YYYY-MMM-DD'},
                                        {showWeekNumbers: false},
                                        {rangeInputFormat: 'L'} );

    this.loadPracticeHistory()
        .then( data => {this.traininghistory = data;
                        this.pagedHistory = this.traininghistory.slice(1, this.itemsPerPage);
                        this.loaded = true; })
        .catch(err => this.alertService.error('Sikertelen kapcsolat a szerverhez! ' + err.message) );

  }


loadPracticeHistory() {
  const timerangevalue = this.timerange.map(elem => elem.valueOf());
  return this.dataService.getpracticehistory(this.authService.getCurrentUser().ID, timerangevalue)
                  .toPromise();

}

  getpracticehistory() {

    const timerangevalue = this.timerange.map(elem => elem.valueOf());
    console.log(timerangevalue);
    this.dataService.getpracticehistory(this.authService.getCurrentUser().ID, timerangevalue)
                    .subscribe( data => {this.traininghistory = data; },
                                err => this.alertService.error('Sikertelen kapcsolat a szerverhez! ' + err.message) );

  }


  pageChanged(event: PageChangedEvent): void {
    console.log(event);
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedHistory = this.traininghistory.slice(startItem, endItem);
    this.cdRef.detectChanges();
  }

}
