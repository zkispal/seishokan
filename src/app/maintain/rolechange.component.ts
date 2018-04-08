import { Component, OnInit } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import {  DataService, AlertService } from '../_services/index';
import { Options, Location } from '../_models/index';
import 'rxjs/add/operator/toPromise';
import { callLifecycleHooksChildrenFirst } from '@angular/core/src/view/provider';

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
assistantID = 0;



  constructor(private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.loadRole('Assistant')
        .then(id => {this.assistantID = id;
                    this.loadassistants(); })
        .catch(err => { this.alertService.error('Asszisztens adatok betöltése sikertelen! ' + err.message); } );

    this.loadsempais();
  }

  /* Change the observeable to a Prmise. It makes theneable  so in ngOnInit we can ensure it runs first and then we can call
loadasssistant() */
  loadRole(_rolename) {
    return this.dataService.getroleid(_rolename).toPromise();
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

   this.dataService.getroleholder(this.assistantID)
        .subscribe(assistants => { this.assistants = assistants; },
          err => this.alertService.error('Asszisztensek betöltése sikertelen! ' + err.message));

  }


  upload() {
    if (this.assistants.length === 0) {
      this.dataService.delroleholder(this.assistantID)
          .subscribe(res => { this.alertService.success('Kinevezés/visszavonás sikeres.'); },
                     err => this.alertService.error('Kinevezés/visszavonás megerősítése sikertelen! ' + err.message));
    } else {
      this.records = [];
      this.assistants.forEach(elem => this.records.push({personID: elem.ID, roleID: this.assistantID }) );

      this.dataService.updtroleholder(this.records)
          .subscribe( res => {this.alertService.success('Kinevezés/visszavonás sikeres.'); },
                      err => this.alertService.error('Kinevezés/visszavonás megerősítése sikertelen! ' + err.message));
    }

  }

}
