import { Component, OnInit, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import * as _ from 'lodash';
import { Event, Options } from '../_models/index';
import { DataService} from '../_services/index';



@Component({
  selector: 'app-neweventmodal',
  templateUrl: './neweventmodal.component.html',
  styleUrls: ['./neweventmodal.component.css']
})
export class NeweventmodalComponent implements OnInit {


  closed: EventEmitter<any> = new EventEmitter();
  newevent: Event;
  eventtypes: Options[];
  locationnames: Options[];
  loading: boolean;
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(public bsModalRef: BsModalRef,
    private dataService: DataService) { }

  ngOnInit() {
    this.resetNewEvent();
  }


  resetNewEvent() {
    this.newevent = {ID: -1, name: '',
    start: new Date(),
    end: new Date(),
    locationID: -1,
    eventtypeID: -1};

  }


  addevent() {
    this.loading = true;
    this.dataService.addevent(_.omit(this.newevent, 'ID'))
    .subscribe(
      data => {
          this.resetNewEvent();
          this.loading = false;
      },
      error => {
          this.loading = false;
      });

  }

  closeModal() {
    this.closed.emit('modalClosedEvent$');
    this.bsModalRef.hide();
  }

}
