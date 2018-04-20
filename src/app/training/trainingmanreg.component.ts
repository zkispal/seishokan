import { Component, OnInit } from '@angular/core';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService  } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
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
  // currentUser: User;

  bsConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;
  locale = 'hu';

  attendanceRecord = new Attendance();


  constructor(private dataService: DataService,
              private authService: AuthLoginService,
              private alertService: AlertService,
              private bsLocService: BsLocaleService) { }

  ngOnInit() {
    this.loadDojos();
    this.loadInstructors();
    this.initAttendanceRec();
    this.dpmaxdate =  new Date();
    this.dpmindate =  new Date();
    this.dpmindate.setMonth(this.dpmindate.getMonth() - 1);
    this.bsLocService.use(this.locale);
    this.bsConfig = Object.assign({},   {containerClass: 'theme-dark-blue'},
      {maxDate: this.dpmaxdate},
      {minDate: this.dpmindate},
      {dateInputFormat: 'YYYY-MMM-DD'},
      {showWeekNumbers: false});

    }

    private initAttendanceRec() {

      this.attendanceRecord.attendeeID = parseInt(this.authService.getCurrentUser().ID, 10);
      this.attendanceRecord.attendancetype = 'Registered';
      this.attendanceRecord.eventID = 0;
      this.attendanceRecord.instructorID = 0;

    }

  private loadDojos() {
    this.dataService.getdojos()
                    .subscribe( res => { this.dojos = res; },
                                err => { this.alertService.error('Dojolista betöltése sikertelen. ' + err.message); }  ) ;
  }

  private loadInstructors() {
    this.dataService.getinstructors()
                    .subscribe( res => { this.instructors = res; },
                                err => { this.alertService.error('Oktatólista betöltése sikertelen. ' + err.message); }  ) ;
  }

  private getPractice() {
    this.dataService.getpracticeByDateByLocID(this.trainingDay.setHours(12), this.locID)
                    .subscribe( res => {  if (res.length === 0) {
                      this.alertService.warn('Ezen a napon ebben a dojoban nem volt edzés!');
                    } else {this.trainings = res; } },
                      err => {this.alertService.error('Edzéslista betöltése sikertelen. ' + err.message); }  ) ;
  }


  private addattendancereg() {
    if (this.attendanceRecord.attendeeID === this.attendanceRecord.instructorID) {
      this.alertService.error('Önregisztráció nem megengedett!');
    } else {
    this.dataService.addattendancereg(this.attendanceRecord)
                    .subscribe( res => {  this.alertService.success('Sikeres utólagos edzésrészvétel rögzítés.'); },
                                err => { console.log(JSON.stringify(err));
                                  this.alertService.error('Sikertelen utólagos edzésrészvétel rögzítés. ' + err.message); }  ) ;
    }
  }
}
