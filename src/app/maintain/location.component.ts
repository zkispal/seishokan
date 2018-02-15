import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DataService } from '../_services/index';
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
  loctypes: string[];
  loading: boolean;
  bsModalRef: BsModalRef;
  locToUpdate: Location;


  constructor(private dataService: DataService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.loadLocations();
    this.loadLocationTypes();
  }

  private loadLocations() {

   this.dataService.getlocations().subscribe( resp => this.locs = resp,
                                              err => console.log(err));
  }


  private loadLocationTypes() {

   this.dataService.getlocationtypes().subscribe(resp => this.loctypes = resp,
                                                err => console.log(err));
  }


  openNewlocModal() {

    this.bsModalRef = this.modalService.show(NewlocmodalComponent);
    this.bsModalRef.content.title = 'Új helyszín hozzáadása';
    this.bsModalRef.content.loctypes = this.loctypes;
    this.bsModalRef.content.closed.take(1).subscribe(this.loadLocations.bind(this));
  }


  deleteloc(_id: string) {
    this.dataService.deleteloc(_id).subscribe(() => { this.loadLocations(); });
  }

  updateloc(i) {
    this.locToUpdate = this.locs[i];
    this.dataService.updateloc(this.locToUpdate).subscribe(  data => { this.loadLocations(); },
                                                              err => {console.log(err); });
  }


}
