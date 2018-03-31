import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import * as _ from 'lodash';
import { DataService, AlertService } from '../_services/index';
import { EventregComponent } from '../_ui/index';


@Component({
  selector: 'app-examreg',
  templateUrl: './examreg.component.html',
  styleUrls: ['./examreg.component.css']
})
export class ExamregComponent implements OnInit {

  exams: any[];
  title: string;


  constructor(private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {
    registerLocaleData(localeHu);
    this.dataService.getexams()
        .subscribe( data => { this.exams = data; },
                    err => this.alertService.error('Sikertelen vizsgalista letöltés! ' + err.message));
    this.title = 'Vizsgaregisztráció';
  }

}
