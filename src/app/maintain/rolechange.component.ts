import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import {  DataService } from '../_services/index';
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



  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.loadsempais();
    this.loadassistants();
  }


  loadsempais() {

    this.dataService.getsempais()
        .subscribe( sempais => {this.sempais = sempais; },
                    err => console.log(err));
  }


  loadassistants() {

    this.dataService.getroleholder(this.roleid)
        .subscribe(assistants => {console.log(JSON.stringify(assistants)); this.assistants = assistants; },
                  err => console.log(err));

  }


  upload() {
    if (this.assistants.length === 0) {
      this.dataService.delroleholder(this.roleid)
          .subscribe(res => {console.log(JSON.stringify(res)); },
                     err => console.log(err));
    } else {
      this.records = [];
      this.assistants.forEach(elem => this.records.push({personID: elem.ID, roleID: this.roleid }) );
      console.log(JSON.stringify(this.records));
      this.dataService.updtroleholder(this.records)
          .subscribe(res => {console.log(JSON.stringify(res)); },
                    err => console.log(err));
    }

  }


  log($event) {
    console.log($event);
  }


}
