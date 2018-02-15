import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as _ from 'lodash';
import {Location} from '../_models/index';
import { DataService} from '../_services/index';





@Component({
  selector: 'app-newlocmodal',
  templateUrl: './newlocmodal.component.html',
  styleUrls: ['./newlocmodal.component.css']
  })

  export class NewlocmodalComponent implements OnInit {

    loading: boolean;
    newlocation: Location;
    title: string;
    loctypes: String[];
    closed: EventEmitter<any> = new EventEmitter();

    constructor(public bsModalRef: BsModalRef,
      private dataService: DataService) { }

    ngOnInit() {
      this.resetNewLoc ();
    }


  addlocation () {
    this.loading = true;
    this.dataService.addlocation(_.omit(this.newlocation, 'id'))
    .subscribe(
      data => {
          this.resetNewLoc ();
      },
      error => {
          this.loading = false;
      });

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
    this.bsModalRef.hide();
  }


}
