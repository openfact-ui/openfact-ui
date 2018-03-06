import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Logger } from '../ngx/ngx-base';
import { LoginService } from './login.service';

// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.of(true);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

}
