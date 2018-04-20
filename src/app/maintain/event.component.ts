import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DataService, AlertService } from '../_services/index';
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

  today: Date;

  bsConfig: Partial<BsDatepickerConfig>;
  dpmindate: Date;
  dpmaxdate: Date;
  locale = 'hu';

  bsModalRef: BsModalRef;

  constructor(private dataService: DataService,
              private modalService: BsModalService,
              private alertService: AlertService,
              private bsLocService: BsLocaleService) { }

  ngOnInit() {

    this.loadEventTypes();
    this.loadLocationNames();
    this.loadEvents();

    this.dpmindate = new Date();
    this.dpmaxdate = new Date();
    this.today = new Date();

    this.dpmindate.setFullYear(this.today.getFullYear() - 1);
    this.dpmaxdate.setFullYear(this.today.getFullYear() + 5);
    this.bsLocService.use(this.locale);
    this.bsConfig = Object.assign({}, {containerClass: 'theme-dark-blue'},
                                      {maxDate: this.dpmaxdate},
                                      {minDate: this.dpmindate},
                                      {dateInputFormat: 'YYYY-MMM-DD'},
                                      {showWeekNumbers: false} );
  }

  private loadEventTypes() {
    this.dataService.geteventtypes()
                    .subscribe(resp => this.eventtypes = resp,
                               err => this.alertService.error('Eseménytípusok betöltése sikertelen! ' + err.message));
  }
  private loadLocationNames() {
    this.dataService.getlocationnames()
                    .subscribe(resp => this.locationnames = resp,
                              err => this.alertService.error('Egyesületi helyszínek listájának betöltése sikertelen! ' + err.message));
  }

  private loadEvents() {
    this.dataService.getallevents()
                    .subscribe(resp => this.events = resp,
                              err => this.alertService.error('Egyesületi események betöltése sikertelen! ' + err.message));
  }

  updateevent(i) {
    this.eventToUpdate = this.events[i];
    this.dataService.updateevent(this.eventToUpdate)
                    .subscribe( data => {this.loadEvents();
                                          this.alertService.success('Esemény módosítása sikeres.'); },
                                err => {this.alertService.error( 'Esemény módosítása sikertelen! ' + err.message) ; });
  }

  deleteevent(id: number) {

      this.dataService.deleteevent(id)
                      .subscribe(() => {this.loadEvents();
                                        this.alertService.success('Esemény törlése sikeres.');  },
                                err => this.alertService.error( 'Esemény törlése sikertelen! ' + err.message) );

    }


  openNeweventModal() {
    this.bsModalRef = this.modalService.show(NeweventmodalComponent);
    this.bsModalRef.content.title = 'Új vizsga/esemény hozzáadása';
    this.bsModalRef.content.eventtypes = this.eventtypes;
    this.bsModalRef.content.locationnames = this.locationnames;
    this.bsModalRef.content.bsConfig = this.bsConfig;
    this.bsModalRef.content.closed.take(1).subscribe(this.loadEvents.bind(this));
  }

}
