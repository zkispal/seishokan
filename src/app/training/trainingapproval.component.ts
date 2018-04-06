import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AuthLoginService, AlertService } from '../_services/index';
import { User, Options } from '../_models/index';


@Component({
  selector: 'app-trainingapproval',
  templateUrl: './trainingapproval.component.html',
  styleUrls: ['./trainingapproval.component.css']
})
export class TrainingapprovalComponent implements OnInit {


  instructorID = '';
  practiceregs = new Array<any>();
  panelTitleText = '';
  panelTitleDate: Date = new Date();
  regnames =  new Array<any>();
  allAttended = false;
  activeEvent = {ID: 0, index: 0};


  constructor(private dataService: DataService,
              private authService: AuthLoginService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.instructorID = this.authService.getCurrentUser().ID;
    this.loadPracticeregs();
  }

  loadPracticeregs() {
      this.allAttended = false;
      this.dataService.getpracticeregs(this.instructorID)
                      .subscribe( resp => { if (resp.length === 0 ) {
                                              this.alertService.info('Nincs jóváhagyásra váró utólagos edzésrögzítés.');
                                            } else {
                                              this.practiceregs = resp; }

                                            },
                                 err => {this.alertService.error('Sikertelen adatlekérés! ' + err.message); }  ) ;
  }


    getRegisteredNames(_i) {
      this.regnames = [];
      this.activeEvent.ID = this.practiceregs[_i].eventID;
      this.activeEvent.index = _i;

      this.panelTitleText = ''.concat(this.practiceregs[_i].dojoname, ' ',
                                  this.practiceregs[_i].practice );
      this.panelTitleDate = this.practiceregs[_i].practicedate;

      this.dataService.getpracticeregnames(this.practiceregs[_i].eventID)
                      .map(srvresp => srvresp.map(elem => _.extend(elem, {attended : false})) )
                      .subscribe(resp => { this.regnames = resp; },
                      err => {this.alertService.error('Edzéshez tartozó regisztrációk lekérése sikertelen. ' + err.message); });
  }

  selectAll() {

    for (let i = 0; i < this.regnames.length; i++) {
      this.regnames[i].attended = this.allAttended;
    }
  }

  checkIfAllSelected() {

      this.allAttended = this.regnames.every(function(item) {
        return item.attended === true;
      });
  }


  approveAttendance() {

    this.dataService.approveAttendance(this.activeEvent.ID, this.regnames.map(elem => _.pick(elem, ['ID', 'attended'])))
                    .subscribe( srvresp => {this.practiceregs.splice( this.activeEvent.index , 1 );
                                            this.regnames = [];
                                            this.alertService.success('Utólagos rögzítés sikeresen jóváhagyva.'); },
                                err => this.alertService.error('Sikertelen jóváhagyás. ' + err.message) );
  }


}
