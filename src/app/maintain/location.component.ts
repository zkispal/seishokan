import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService, AlertService } from '../_services/index';
import { Options, Location } from '../_models/index';
import { Observable } from 'rxjs/Observable';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NewlocmodalComponent } from './newlocmodal.component';



@Component({
  selector: 'app-newlocation',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  locs: Location[];
  locToUpdate: Location;

  loctypes: string[];
  bsModalRef: BsModalRef;



  constructor(private dataService: DataService,
              private modalService: BsModalService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.loadLocations();
    this.loadLocationTypes();
  }

  private loadLocations() {
    this.dataService
        .getlocations()
        .subscribe( resp => this.locs = resp,
                    err => this.alertService.error('Egyesületi helyszínek betöltése sikertelen! ' + err.message));
  }


  private loadLocationTypes() {
    this.dataService
        .getlocationtypes()
        .subscribe( resp => this.loctypes = resp,
                    err => this.alertService.error('Helyszíntípusok betöltése sikertelen! ' + err.message));
  }

  private updateloc(i) {
    this.locToUpdate = this.locs[i];
    this.dataService.updateloc(this.locToUpdate)
        .subscribe( data => { this.loadLocations();
                              this.alertService.success('Helyszín sikeresen módosítva.'); },
                    err => {
                      this.alertService.error('Helyszín módosítása sikertelen! ' + err.error.message); });
  }

  private deleteloc(_id: string) {
    this.dataService
        .deleteloc(_id)
        .subscribe(srvresp => { this.loadLocations();
                                this.alertService.success('Helyszín sikeresen törölve.'); },
                  err => this.alertService.error('Helyszín törlése sikertelen! ' + err.message) );
  }

  openNewlocModal() {

    this.bsModalRef = this.modalService.show(NewlocmodalComponent);
    this.bsModalRef.content.title = 'Új helyszín hozzáadása';
    this.bsModalRef.content.loctypes = this.loctypes;
    this.bsModalRef.content.closed.take(1).subscribe(this.loadLocations.bind(this));
  }
}

