import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DataService } from '../_services/index';
import { Options, Event } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NeweventmodalComponent } from './neweventmodal.component';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  eventtypes: Options[];
  locationnames: Options[];
  events: Event[];
  eventToUpdate: Event;

  bsModalRef: BsModalRef;

  today: Date;

  bsConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;


  constructor(private dataService: DataService,
              private modalService: BsModalService) { }

  ngOnInit() {


    this.dpmindate = new Date();
    this.dpmaxdate = new Date();
    this.today = new Date();
    this.loadEventTypes();
    this.loadLocationNames();
    this.loadEvents();
    this.dpmindate.setFullYear(this.today.getFullYear() - 1);
    this.dpmaxdate.setFullYear(this.today.getFullYear() + 5);
    this.bsConfig = Object.assign({},   {containerClass: 'theme-dark-blue'},
      {maxDate: this.dpmaxdate},
      {minDate: this.dpmindate},
      {dateInputFormat: 'YYYY-MM-DD'},
      {showWeekNumbers: false} );

  }

  private loadEventTypes() {
    this.dataService.geteventtypes().subscribe(resp => this.eventtypes = resp,
                                              err => console.log(err));
  }
  private loadLocationNames() {
    this.dataService.getlocationnames().subscribe(resp => this.locationnames = resp,
                                                  err => console.log(err));
  }

  private loadEvents() {
    this.dataService.getallevents().subscribe(resp => this.events = resp,
                                          err => console.log(err));
  }

  openNeweventModal() {
    this.bsModalRef = this.modalService.show(NeweventmodalComponent);
    this.bsModalRef.content.title = 'Új vizsga/esemény hozzáadása';
    this.bsModalRef.content.eventtypes = this.eventtypes;
    this.bsModalRef.content.locationnames = this.locationnames;
    this.bsModalRef.content.bsConfig = this.bsConfig;
    this.bsModalRef.content.closed.take(1).subscribe(this.loadEvents.bind(this));

  }

  deleteevent(id: number) {

      this.dataService.deleteevent(id).subscribe(() => { this.loadEvents(); },
                                                  err => console.log(err) );

    }


  updateevent(i) {
    this.eventToUpdate = this.events[i];
    this.dataService.updateevent(this.eventToUpdate).subscribe(  data => { this.loadEvents(); },
                                                              err => {console.log(err); });
  }

}
