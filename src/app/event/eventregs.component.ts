
import { Component, OnInit } from '@angular/core';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import * as _ from 'lodash';
import { DataService, AuthLoginService } from '../_services/index';
import { User, Options } from '../_models/index';


@Component({
  selector: 'app-eventregs',
  templateUrl: './eventregs.component.html',
  styleUrls: ['./eventregs.component.css']
})
export class EventregsComponent implements OnInit {

  eventregs = new Array<any>();
  panelTitle = '';
  regnames =  new Array<Options>();
  activeEvent = {ID: 0, index: 0};


  constructor(private dataService: DataService,
              private authService: AuthLoginService) { }

  ngOnInit() {
    this.loadEventRegs();
  }


  loadEventRegs() {

      this.dataService.geteventregs()
                      .subscribe( resp => {  console.log(resp); this.eventregs = resp; },
                                 err => {console.log(err); }  ) ;

  }

  getRegisteredNames(_i) {
    this.regnames = [];
    this.activeEvent.ID = this.eventregs[_i].eventID;
    this.activeEvent.index = _i;

    this.panelTitle = ''.concat(this.eventregs[_i].eventname, ' ',
                                this.eventregs[_i].eventlocation, ' ',
                                this.eventregs[_i].eventdate );

    this.dataService.geteventregnames(this.eventregs[_i].eventID)
                    .subscribe(resp => {  console.log(resp); this.regnames = resp; },
                    err => {console.log(err); });
}

}
