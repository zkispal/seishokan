import { Component, OnInit } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { DataService, AuthLoginService } from '../_services/index';


@Component({
  selector: 'app-examhistory',
  templateUrl: './examhistory.component.html',
  styleUrls: ['./examhistory.component.css']
})
export class ExamhistoryComponent implements OnInit {


  history: Array<any> = [];

  constructor ( private dataService: DataService,
                private authService: AuthLoginService) { }

  ngOnInit() {
    this.loadExamHistory();
  }

  loadExamHistory() {
    this.dataService.getexamhistory(this.authService.getCurrentUser().ID)
                    .subscribe(data => this.history = data,
                                err => console.log(JSON.stringify(err)));
  }


}
