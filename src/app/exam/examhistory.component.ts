import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import * as _ from 'lodash';
import { DataService, AuthLoginService, AlertService } from '../_services/index';


@Component({
  selector: 'app-examhistory',
  templateUrl: './examhistory.component.html',
  styleUrls: ['./examhistory.component.css']
})
export class ExamhistoryComponent implements OnInit {


  history: Array<any> = [];

  constructor ( private dataService: DataService,
                private authService: AuthLoginService,
                private alertService: AlertService) { }

  ngOnInit() {
    this.loadExamHistory();
  }

  loadExamHistory() {
    this.dataService.getexamhistory(this.authService.getCurrentUser().ID)
                    .map(data => _.remove(data, elem => elem.attendancetype !== 'Registered'))
                    .subscribe(data => {console.log(data); this.history = data; },
                                err => this.alertService.error('Vizsgatörténet betöltés sikertelen. ' + err.message));
  }


}
