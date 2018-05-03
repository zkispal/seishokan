import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import * as _ from 'lodash';
import { Event, Options } from '../_models/index';
import { DataService, AlertService} from '../_services/index';



@Component({
  selector: 'app-neweventmodal',
  templateUrl: './neweventmodal.component.html',
  styleUrls: ['./neweventmodal.component.css']
})
export class NeweventmodalComponent implements OnInit {

  title: string;
  closed: EventEmitter<any> = new EventEmitter();
  newevent: Event;
  eventtypes: Options[];
  locationnames: Options[];
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(public bsModalRef: BsModalRef,
              private dataService: DataService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.resetNewEvent();
    this.title = 'Új esemény';
  }


  resetNewEvent() {
    this.newevent = {ID: -1, name: '',
    start: new Date(),
    end: new Date(),
    locationID: -1,
    eventtypeID: -1};

  }


  addevent() {
    this.dataService
        .addevent(_.omit(this.newevent, 'ID'))
        .subscribe( data => { this.resetNewEvent();
                              this.alertService.success('Új esemény létrehozása sikeres.'); },
                    err => { this.alertService.error('Új esemény létrehozása sikertelen!' + err.message); });

  }

  closeModal() {
    this.closed.emit('modalClosedEvent$');
    this.alertService.clear();
    this.bsModalRef.hide();
  }

}
