import { Component, OnInit, ViewChild, LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { ZXingScannerComponent } from '@zxing/ngx-scanner';
import { Result } from '@zxing/library';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
import { AlertComponent } from '../_ui/index';
import { User, Options, Attendance } from '../_models/index';
import * as _ from 'lodash';


@Component({
  selector: 'app-trainingqrreg',
  templateUrl: './trainingqrreg.component.html',
  styleUrls: ['./trainingqrreg.component.css'],

})
export class TrainingqrregComponent implements OnInit {



  @ViewChild('scanner')
  scanner: ZXingScannerComponent;

  hasDevices: boolean;
  hasCameras: boolean;
  hasPermission: boolean;
  qrResultString: string;
  qrResult: Result;
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
              private authService: AuthLoginService,
              private alertService: AlertService ) {

  }

  ngOnInit() {

    this.trainingDay = new Date();
    this.loadDojos();
    this.initAttendanceRec();

    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;
      this.availableDevices = devices;
    });


    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.alertService.error('Nem található kamera az eszközön!');
          console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.scanComplete.subscribe((result: Result) => this.qrResult = result);

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      if (!answer) {
        this.alertService.warn('Kamerahozzáférés megtagadva. QR kód beolvasás lehetetlen.');
      }
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

  getPractice() {
    this.trainings = [];
    this.dataService.getpracticeByDateByLocID(this.trainingDay.valueOf(), this.selectedDojo.ID)
                    .subscribe( res => {
                      if (res.length === 0) {
                        this.alertService.warn('A mai napon ebben a dojoban nincs edzés!');
                      } else {this.trainings = res; } },
                                err => {this.alertService.error(err.message); }  ) ;

  }

  handleQrCodeResult(resultString: string) {

    this.qrResultString = resultString;

    try {
      this.currentAttendee = JSON.parse(resultString);
    } catch (err) {
      this.alertService.error(JSON.stringify(err));
    }

    this.addAttendee(this.currentAttendee);

  }

  onDeviceSelectChange(selectedValue: string) {
      this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }

  addAttendee(_user: Options) {

    this.attendanceRecord.attendeeID = _user.ID;

    if ( _user.ID === parseInt(this.authService.getCurrentUser().ID, 10)) {
      this.alertService.error('Saját magadnak nem igazolhatsz edzést!');
    } else {
      if (_.indexOf(this.allAttendeeNames, _user.name) === -1 && this.attendanceRecord.attendeeID !== 0 ) {
        this.allAttendeeNames.push(_user.name);
        this.allAttendance.push(_.assign({}, this.attendanceRecord));
        } else {
          this.alertService.warn(_user.name + ' már beolvasva.');
        }
    }

  }

  setTrainingID() {
    this.attendanceRecord.eventID = this.selectedTraining.ID;
  }

   addattendance() {
    this.dataService.addattendance(this.allAttendance)
                    .subscribe( res => {this.allAttendance = [];
                                        this.allAttendeeNames = [];
                                        this.alertService.success('Edzésrészvétel sikeresen rögzítve.'); },
                                err => {
                                  this.alertService.error('Sikertelen edzésrögzítés. ' + err.message);
                                });

  }

}
