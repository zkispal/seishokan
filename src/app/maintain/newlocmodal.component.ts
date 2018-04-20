import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';
import {Location} from '../_models/index';
import { DataService, AlertService} from '../_services/index';





@Component({
  selector: 'app-newlocmodal',
  templateUrl: './newlocmodal.component.html',
  styleUrls: ['./newlocmodal.component.css']
  })

  export class NewlocmodalComponent implements OnInit {

    newlocation: Location;
    title: string;
    loctypes: string[];
    closed: EventEmitter<any> = new EventEmitter();

    constructor(public bsModalRef: BsModalRef,
                private dataService: DataService,
                private alertService: AlertService) { }

    ngOnInit() {
      this.resetNewLoc ();
    }


  addlocation () {
    this.dataService
        .addlocation(_.omit(this.newlocation, 'id'))
        .subscribe( data => { this.resetNewLoc ();
                              this.alertService.success('Új helyszín létrehozása sikeres.'); },
                    err => { this.alertService.error('Új helyszín létrehozása sikertelen! ' + err.message); });

  }

  resetNewLoc () {
    this.newlocation = {id: '', name: '', city: '', zipcode: '',
    address: '',
    building: '',
    lat: 0.0,
    lon: 0.0,
    locationtype: ''};

  }


  closeModal() {
    this.closed.emit('modalClosedEvent$');
    this.alertService.clear();
    this.bsModalRef.hide();
  }


}
