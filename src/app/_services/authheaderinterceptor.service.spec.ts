import { TestBed, inject } from '@angular/core/testing';
import {AuthHeaderInterceptorService} from './index';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

describe('CustomhttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthHeaderInterceptorService]
    });
  });

  it('should be created', inject([AuthHeaderInterceptorService], (service: AuthHeaderInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
