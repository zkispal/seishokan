import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import {  DataService, AlertService } from '../_services/index';
import { Options, Location } from '../_models/index';

@Component({
  selector: 'app-rolechange',
  templateUrl: './rolechange.component.html',
  styleUrls: ['./rolechange.component.css']
})
export class RolechangeComponent implements OnInit {


sempais: Array<Options>;
assistants: Array<Options>;

key  = 'ID';
display  = 'name';
format =  { add: 'Kinevez',
            remove: 'Visszavon',
            all: 'Mindet kijelöl',
            none: 'Kijelölés visszavonás',
            direction: 'left-to-right',
            draggable: true };
records: Array<{personID: number, roleID: number}> = [];
roleid = 13;



  constructor(private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.loadsempais();
    this.loadassistants();
  }


  loadsempais() {

    this.dataService
        .getsempais()
        .subscribe( sempais => {
          if (sempais.length === 0) {
               this.alertService.warn('Nincs kinevezhető tapasztalt aikidoka.');
          } else {this.sempais = sempais; } },
                    err => this.alertService.error('Kinevezhető aikidokák betöltése sikertelen! ' + err.message));
  }


  loadassistants() {

    this.dataService
        .getroleholder(this.roleid)
        .subscribe(assistants => { this.assistants = assistants; },
          err => this.alertService.error('Asszisztensek betöltése sikertelen! ' + err.message));

  }


  upload() {
    if (this.assistants.length === 0) {
      this.dataService
          .delroleholder(this.roleid)
          .subscribe(res => { this.alertService.success('Kinevezés/visszavonás sikeres.'); },
                     err => this.alertService.error('Kinevezés/visszavonás megerősítése sikertelen! ' + err.message));
    } else {
      this.records = [];
      this.assistants.forEach(elem => this.records.push({personID: elem.ID, roleID: this.roleid }) );

      this.dataService
          .updtroleholder(this.records)
          .subscribe( res => {this.alertService.success('Kinevezés/visszavonás sikeres.'); },
                      err => this.alertService.error('Kinevezés/visszavonás megerősítése sikertelen! ' + err.message));
    }

  }


/*   log($event) {
    console.log($event);
  } */


}
