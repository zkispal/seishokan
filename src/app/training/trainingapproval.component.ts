import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AuthLoginService } from '../_services/index';
import { User, Options } from '../_models/index';


@Component({
  selector: 'app-trainingapproval',
  templateUrl: './trainingapproval.component.html',
  styleUrls: ['./trainingapproval.component.css']
})
export class TrainingapprovalComponent implements OnInit {


  instructorID = '';
  practiceregs = new Array<any>();
  panelTitle = '';
  regnames =  new Array<any>();
  allAttended = false;
  activeEvent = {ID: 0, index: 0};


  constructor(private dataService: DataService,
              private authService: AuthLoginService) { }

  ngOnInit() {
    this.instructorID = this.authService.getCurrentUser().ID;
    this.loadPracticeregs();
  }

  loadPracticeregs() {
      this.allAttended = false;
      this.dataService.getpracticeregs(this.instructorID)
                      .subscribe( resp => {  console.log(resp); this.practiceregs = resp; },
                                 err => {console.log(err); }  ) ;
  }


    getRegisteredNames(_i) {
      this.regnames = [];
      this.activeEvent.ID = this.practiceregs[_i].eventID;
      this.activeEvent.index = _i;

      this.panelTitle = ''.concat(this.practiceregs[_i].dojoname, ' ',
                                  this.practiceregs[_i].practicedate, ' ',
                                  this.practiceregs[_i].practice );

      this.dataService.getpracticeregnames(this.practiceregs[_i].eventID)
                      .map(srvresp => srvresp.map(elem => _.extend(elem, {attended : false})) )
                      .subscribe(resp => {  console.log(resp); this.regnames = resp; },
                      err => {console.log(err); });
  }

  selectAll() {
    console.log('selectAll() was called');
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
    // this.regnames = this.regnames.map(elem => _.pick(elem, ['ID', 'attended']));
    console.log('approveAttendance() was clicked' );
    console.log('regnames: ' + JSON.stringify(this.regnames) );
    this.dataService.approveAttendance(this.activeEvent.ID, this.regnames.map(elem => _.pick(elem, ['ID', 'attended'])))
                    .subscribe( srvresp => {console.log (srvresp);
                                            this.practiceregs.splice( this.activeEvent.index , 1 );
                                            this.regnames = []; },
                                err => console.log (err));
  }


}
