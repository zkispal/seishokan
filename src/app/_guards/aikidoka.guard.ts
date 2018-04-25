import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthLoginService} from '../_services/index';

@Injectable()
export class AikidokaGuard implements CanActivate {

  constructor (private authLoginSrvc: AuthLoginService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      return this.authLoginSrvc.isRoleHolder('Aikidoka');

  }
}
