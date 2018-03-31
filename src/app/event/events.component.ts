import { Component, OnInit, LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { DataService, AlertService } from '../_services/index';
import { EventregComponent } from '../_ui/index';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: any[];
  title: string;


  constructor(private dataService: DataService,
              private alertService: AlertService ) { }

  ngOnInit() {
    registerLocaleData(localeHu);
    this.dataService.getevents()
        .subscribe( data => {this.events = data; },
                    err => this.alertService.error('Sikertelen eseménylista letöltés! ' + err.message));
    this.title = 'Eseményregisztráció';
  }




}
