import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Options, Location, Event } from '../_models/index';


@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }


  getadultranks() {
    return this.http.get<Array<Options>>('/data/getadultranks');
  }

  getdojos() {
    return this.http.get<Array<Options>>('/location/getdojos');
  }

  getweekdays() {
    return this.http.get<Array<Options>>('/data/getweekdays');
  }


  getpracticetypes() {
    return this.http.get<Array<Options>>('/data/getpracticetypes');
  }

  getlocationnames() {
    return this.http.get<Array<Options>>('/location/getlocationnames');
  }

  geteventtypes() {
    return this.http.get<Array<Options>>('/event/geteventtypes');
  }

  getevents() {
    return this.http.get<Array<any>>('/event/getevents');
  }

  getallevents() {
    return this.http.get<Array<Event>>('/event/getallevents');
  }

  getexams() {
    return this.http.get<Array<any>>('/event/getexams');
  }

  getlocations() {
    return this.http.get<Array<Location>>('/location/getlocations');
  }

  getlocationtypes() {
    return this.http.get<Array<string>>('/location/getlocationtypes');
  }

  addlocation (newlocation) {
    return this.http.post('/location/addlocation', newlocation);
  }

  updateloc (loc) {
    return this.http.put('/location/' + loc.ID, loc,
      { headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'} // Needed because of Angular bug #18396
    );
  }

  deleteloc(id) {
    return this.http.delete('/location/' + id,
    { headers: new HttpHeaders().set('Content-Type', 'application/json'),
    responseType: 'text'} // Needed because of Angular bug #18396
    );
  }

  addevent (newevent) {
    return this.http.post('/event/addevent', newevent);
  }

  deleteevent(id) {
    return this.http.delete('/event/' + id,
      { headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'} // Needed because of Angular bug #18396
    );
  }


  updateevent(event) {
    return this.http.put('/event/' + event.ID, event,
      { headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'} // Needed because of Angular bug #18396
    );
  }

  getreginfo(_id) {

    return this.http.get<Array<any>>('/event/getreginfo/' + _id);
  }



  registerforevent(_regrecord) {

    return this.http.post('/event/register/', _regrecord,
    { headers: new HttpHeaders().set('Content-Type', 'application/json'),
    responseType: 'text'} // Needed because of Angular bug #18396
   );

  }

  unregisterfromevent(_regrecord) {

    return this.http.post('/event/unregister/', _regrecord,
    { headers: new HttpHeaders().set('Content-Type', 'application/json'),
    responseType: 'text'} // Needed because of Angular bug #18396
   );

  }


  getsempais() {
    return this.http.get<Array<Options>>('/data/getsempais');
  }


  getroleholder(_id) {
    return this.http.get<Array<Options>>('/data/getroleholders/' + _id);
  }

  delroleholder(_id) {
    return this.http.delete('/data/roleholders/' + _id
/*     { headers: new HttpHeaders().set('Content-Type', 'application/json'),
    responseType: 'text'} // Needed because of Angular bug #18396 */
    );
  }

  updtroleholder(_records) {
    return this.http.post('/data/roleholders/', _records
/*     { headers: new HttpHeaders().set('Content-Type', 'application/json'),
    responseType: 'text'} // Needed because of Angular bug #18396 */
    );
  }

  addtraining(_newtrainings) {
    return this.http.post('/event/addpractice/', _newtrainings);
  }




}


