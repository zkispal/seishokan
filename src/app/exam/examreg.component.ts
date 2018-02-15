import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import * as _ from 'lodash';
import { DataService, AuthLoginService } from '../_services/index';
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
    private authService: AuthLoginService) { }

  ngOnInit() {
    registerLocaleData(localeHu);
    this.dataService.getexams()
        .subscribe( data => {console.log('returnedby getevent: ' + data); this.exams = data; },
                    err => console.log(err));
    this.title = 'Vizsgaregisztráció';
  }

}
