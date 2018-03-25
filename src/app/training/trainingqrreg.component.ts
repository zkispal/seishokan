import { Component, OnInit, ViewChild } from '@angular/core';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import * as _ from 'lodash';
import { Result } from '@zxing/library';
import { DataService, AuthLoginService } from '../_services/index';
import { User, Options, Attendance } from '../_models/index';

@Component({
  selector: 'app-trainingqrreg',
  templateUrl: './trainingqrreg.component.html',
  styleUrls: ['./trainingqrreg.component.css'],

})
export class TrainingqrregComponent implements OnInit {



  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  dojos: Options[];
  selectedDojo: Options = {ID: 0, name: ''};
  trainings: Options[];
  selectedTraining:  Options = {ID: 0, name: ''};
  trainingDay: Date;
  currentUser: User;
  currentAttendee: Options;

  attendanceRecord = new Attendance();
  allAttendance: Attendance[] = [];
  allAttendeeNames: string[] = [];

  constructor (private dataService: DataService,
              private authService: AuthLoginService) {

  }

  ngOnInit() {

    this.trainingDay = new Date(2018, 2, 19, 12, 0, 0);
    this.loadDojos();
    this.initAttendanceRec();
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;


    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
          console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });



  }

  private loadDojos() {
    this.dataService.getdojos()
                    .subscribe( res => {  this.dojos = res; },
                                err => {console.log(err); }  ) ;
  }

  private initAttendanceRec() {

    this.attendanceRecord.attendeeID = 0;
    this.attendanceRecord.attendancetype = 'Attended';
    this.attendanceRecord.eventID = 0;
    this.attendanceRecord.instructorID = parseInt(this.authService.getCurrentUser().ID, 10);

  }

  private getPractice() {
    this.dataService.getpracticeByDateByLocID(this.trainingDay.valueOf(), this.selectedDojo.ID)
                    .subscribe( res => {  this.trainings = res; },
                      err => {console.log(err); }  ) ;

  }

  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;

    try {
      this.currentAttendee = JSON.parse(resultString);
    } catch (err) {
        console.log('Invalid JSON given\n\n' + resultString );
    }

    this.addAttendee(this.currentAttendee);

  }

  onDeviceSelectChange(selectedValue: string) {
      console.log('Selection changed: ', selectedValue);
      this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

  addAttendee(_user: Options) {

    this.attendanceRecord.attendeeID = _user.ID;

    if ( _user.ID === parseInt(this.authService.getCurrentUser().ID, 10)) {
      console.log('Cannot self register.');
    } else {
      if (_.indexOf(this.allAttendeeNames, _user.name) === -1 && this.attendanceRecord.attendeeID !== 0 ) {
        this.allAttendeeNames.push(_user.name);
        this.allAttendance.push(_.assign({}, this.attendanceRecord));
        } else {
          console.log(_user.name + ' already added.');
        }
    }

  }

  setTrainingID() {
    this.attendanceRecord.eventID = this.selectedTraining.ID;
  }

   addattendance() {
    console.log('addattendance() was clicked' + JSON.stringify(this.allAttendance));
    this.dataService.addattendance(this.allAttendance)
                    .subscribe( res => {  console.log('Attendance successfully added' + res); },
                                err => {console.log(err); }  ) ;

  }

}
