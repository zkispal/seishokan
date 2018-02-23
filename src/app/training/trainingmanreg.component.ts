import { Component, OnInit } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AuthLoginService } from '../_services/index';
import { User, Options, Attendance } from '../_models/index';
@Component({
  selector: 'app-trainingmanreg',
  templateUrl: './trainingmanreg.component.html',
  styleUrls: ['./trainingmanreg.component.css']
})
export class TrainingmanregComponent implements OnInit {

  dojos: Options[];
  trainings: Options[];
  trainingDay = new Date();
  locID: number;
  instructors: Options[];
  currentUser: User;

  bsConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;


  attendanceRecord = new Attendance();


  constructor(private dataService: DataService,
              private authService: AuthLoginService) { }

  ngOnInit() {
    this.loadDojos();
    this.loadInstructors();
    this.initAttendanceRec();
    this.dpmaxdate =  new Date();
    this.dpmindate =  new Date();
    this.dpmindate.setMonth(this.dpmindate.getMonth() - 1);
    this.bsConfig = Object.assign({},   {containerClass: 'theme-dark-blue'},
      {maxDate: this.dpmaxdate},
      {minDate: this.dpmindate},
      {dateInputFormat: 'YYYY-MM-DD'},
      {showWeekNumbers: false} );

    }

    private initAttendanceRec() {
      this.currentUser = this.authService.getCurrentUser();
      this.attendanceRecord.attendeeID = this.currentUser.ID;
      this.attendanceRecord.attendancetype = 'Registered';
      this.attendanceRecord.eventID = 0;
      this.attendanceRecord.instructorID = 0;

    }

  private loadDojos() {
    this.dataService.getdojos()
                    .subscribe( res => {  this.dojos = res; },
                                err => {console.log(err); }  ) ;
  }

  private loadInstructors() {
    this.dataService.getinstructors()
                    .subscribe( res => {  this.instructors = res; },
                                err => {console.log(err); }  ) ;
  }

  private getPractice() {
    this.dataService.getpracticeByDateByLocID(this.trainingDay.setHours(this.trainingDay.getHours() + 23), this.locID)
                    .subscribe( res => {  this.trainings = res; },
                      err => {console.log(err); }  ) ;
  }


  private addattendance() {
    console.log('addattendance() was clicked' + JSON.stringify(this.attendanceRecord));
    this.dataService.addattendance(this.attendanceRecord)
                    .subscribe( res => {  console.log('Attendance successfully added' + res); },
                                err => {console.log(err); }  ) ;

  }
}
