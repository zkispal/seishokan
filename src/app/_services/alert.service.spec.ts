import { TestBed, inject } from '@angular/core/testing';
import { Router, NavigationStart } from '@angular/router';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs/Observable';


class MockRouter {
  // Router
  public navStart = new NavigationStart(0, 'https://localhost:4334/authlogin/login');
  public events = new Observable(observer => {
    observer.next(this.navStart);
    observer.complete();
  });
}
describe('AlertService', () => {



  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertService,
        { provide: Router, useValue: MockRouter }]
    });
  });

  it('should be created', inject([AlertService], (service: AlertService) => {
    expect(service).toBeTruthy();
  }));
});
