import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthLoginService} from '../_services/index';

@Injectable()
export class InstructorGuard implements CanActivate {

  constructor (private authLoginSrvc: AuthLoginService) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.authLoginSrvc.isRoleHolder('Instructor') ||
        this.authLoginSrvc.isRoleHolder('Assistant')) { return true;
    } else {
      return false;
    }
  }
}
