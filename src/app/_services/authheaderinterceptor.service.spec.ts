import { TestBed, inject } from '@angular/core/testing';

import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

describe('CustomhttpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomhttpService]
    });
  });

  it('should be created', inject([CustomhttpService], (service: CustomhttpService) => {
    expect(service).toBeTruthy();
  }));
});
