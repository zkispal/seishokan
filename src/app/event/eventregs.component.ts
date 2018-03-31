
import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AlertService } from '../_services/index';
import { User, Options } from '../_models/index';


@Component({
  selector: 'app-eventregs',
  templateUrl: './eventregs.component.html',
  styleUrls: ['./eventregs.component.css']
})
export class EventregsComponent implements OnInit {

  eventregs = new Array<any>();
  panelTitle = { text : '', date : new Date()};
  regnames =  new Array<Options>();
  activeEvent = {ID: 0, index: 0};


  constructor(private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.loadEventRegs();
  }


  loadEventRegs() {

      this.dataService.geteventregs()
                      .subscribe( resp => { this.eventregs = resp; },
                                 err => {this.alertService.error('Eseményregisztrációk betöltése sikertelen! ' + err.message ); }  ) ;

  }

  getRegisteredNames(_i) {
    this.regnames = [];
    this.activeEvent.ID = this.eventregs[_i].eventID;
    this.activeEvent.index = _i;

    this.panelTitle.text = ''.concat(this.eventregs[_i].eventname, ' ',
                            this.eventregs[_i].eventlocation );
    this.panelTitle.date = this.eventregs[_i].eventdate;

    this.dataService.geteventregnames(this.eventregs[_i].eventID)
                    .subscribe(resp => { this.regnames = resp; },
                    err => {this.alertService.error('Az eseményre regisztráltak listájának letöltése sikertelen! ' + err.message); });
  }

}
