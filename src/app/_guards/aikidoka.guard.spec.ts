import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthLoginService} from '../_services/index';
import { AikidokaGuard } from './aikidoka.guard';

describe('AikidokaGuard', () => {

  let userServiceStub: Partial<AuthLoginService>;


  beforeEach(() => {

    userServiceStub = {
      loggedIn: function () { return true; } ,

    };

    TestBed.configureTestingModule({
      providers: [AikidokaGuard,
                  AuthLoginService]
    });
  });

  it('should ...', async(inject([AikidokaGuard], (guard: AikidokaGuard) => {
    expect(guard).toBeTruthy();
  })));
});
