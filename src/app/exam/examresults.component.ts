import { Options } from './../_models/options';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { Operator } from 'rxjs/Operator';

@Component({
  selector: 'app-examresults',
  templateUrl: './examresults.component.html',
  styleUrls: ['./examresults.component.css']
})
export class ExamresultsComponent implements OnInit {

  years: number[];
  selectedYear: number;
  examsInaYear: Options[];
  selectedExam: number;
  adultRanks: Options[];
  allSuccessful = false;
  participants = [];
  updateRecord = {eventID: 0,
                  attendeeID: 0,
                  attendancetype: '',
                  certno: '',
                  rankID: 0};


  constructor(private dataService: DataService,
              private authService: AuthLoginService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.loadExamYears();
    this.loadadultranks();

  }

  loadExamYears () {
    this.dataService.getexamyears()
        .map(resp => resp.map(elem => _.values(elem)))
        .subscribe (data => this.years = _.flatten(data),
          err => this.alertService.error('Sikertelen szerverkapcsolat. ' + err.message));

  }


  getExamsInYear(_year) {

    this.dataService.getpastexams(_year)
        .subscribe(data => this.examsInaYear = data,
        err => this.alertService.error('Sikertelen szerverkapcsolat. ' + err.message));

  }

  getExamParticipants(_ID) {
    console.log(_ID);
    this.dataService.getexamregnames(_ID)
        .map(srvresp => srvresp.map(elem => _.extend(elem, {attendancetype: '', certno: '', rankID: 0})))
        .subscribe(  data => {  this.participants = data; },
          err => {this.alertService.error('Sikertelen szerverkapcsolat. ' + err.message); } );


  }

  private loadadultranks() {
    this.dataService.getadultranks()
        .subscribe(  res => {  this.adultRanks = res; },
                     err => {this.alertService.error('Sikertelen szerverkapcsolat. ' + err.message); } );
  }

  updateExamResults(_result) {
    const record = _result;
    if (record.attendancetype === 'Sikertelen') {
      record.rankID = 0;
      record.certno = '';
    }

   this.dataService.updateExamResults(record, this.selectedExam)
        .subscribe( data => { this.alertService.success('Vizsgaeredmények sikeresen regisztrálva.'); },
                    err => {this.alertService.error('Sikertelen vizsgaeredmény regisztrálás. ' + err.message); } );
  }

}
