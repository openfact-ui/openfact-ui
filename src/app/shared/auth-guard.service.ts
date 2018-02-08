import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { Logger } from '../ngx/ngx-base';
import { AuthenticationService } from '../ngx/ngx-login-client';
import { LoginService } from './login.service';
//import {OpenfactRuntimeConsoleService} from './runtime-console/openfact-runtime-console.service';

// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected auth: AuthenticationService,
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService,
  /*private openfactRuntimeConsoleService: OpenfactRuntimeConsoleService*/) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.of(true);
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

}
