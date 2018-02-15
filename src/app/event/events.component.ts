import { Component, OnInit, LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { DataService } from '../_services/index';
import { EventregComponent } from '../_ui/index';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: any[];
  title: string;


  constructor(private dataService: DataService) { }

  ngOnInit() {
    registerLocaleData(localeHu);
    this.dataService.getevents()
        .subscribe( data => {console.log('returnedby getevent: ' + data); this.events = data; },
                    err => console.log(err));
    this.title = 'Eseményregisztráció';
  }




}
