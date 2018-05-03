import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TestBed, getTestBed , inject, async, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthLoginService } from './index';

describe('AuthLoginService', () => {

  let injector: TestBed;
  let autLogSrvc: AuthLoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthLoginService]
    });
    injector = getTestBed();
    autLogSrvc = injector.get(AuthLoginService);
    httpMock = injector.get(HttpTestingController);
  });



  it('should be created', async(inject([AuthLoginService], (service: AuthLoginService) => {
    expect(service).toBeTruthy();
  })));
});
