import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams  } from '@angular/common/http';
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

  getroleid(rolename) {
    return this.http.get<number>('/data/getroleid/' + rolename);
  }


  getinstructors() {
    return this.http.get<Array<Options>>('/data/getinstructors');
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
    return this.http.get<Array<any>>('/event/getfutureexams');
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

  getpracticeByDateByLocID(_trainingDay, _locID) {

    const params = {start: _trainingDay, locID: _locID };

    return this.http.get<Array<Options>>('/event/getpractice/', { params: params });

  }

  addattendance(_attendanceRec) {
    return this.http.post('/event/addattendance/', _attendanceRec);

  }

  getpracticeregs (_instructorID) {
    return this.http.get<Array<any>>('/event/getpracticeregs/' + _instructorID);

  }

  getpracticeregnames(_eventID) {
    return this.http.get<Array<Options>>('/event/getpracticeregnames/' + _eventID);
  }

  geteventregnames(_eventID) {
    return this.http.get<Array<Options>>('/event/geteventregnames/' + _eventID);
  }

  getexamregnames(_eventID) {
    return this.http.get<Array<Options>>('/event/getexamregnames/' + _eventID);
  }

  approveAttendance(_eventID, _regnames) {
    return this.http.post('/event/approveattendance/' + _eventID, _regnames);
  }

  geteventregs () {
    return this.http.get<Array<any>>('/event/geteventregs/');
  }

  getexamhistory (_id) {
    return this.http.get<Array<any>>('/event/getexamhistory/' + _id);
  }

  getexamyears () {
    return this.http.get<Array<any>>('/event/getexamyears/');
  }

  getpastexams (_year) {
    return this.http.get<Array<Options>>('/event/getpastexams/' + _year);
  }


  updateExamResults (_result, _eventID) {
    return this.http.post('/event/updateexam/' + _eventID, _result);
  }

  getpracticehistory (_id, _timerange) {
    return this.http.post<Array<any>>('/event/getpracticehistory/' + _id, _timerange);
  }

}


