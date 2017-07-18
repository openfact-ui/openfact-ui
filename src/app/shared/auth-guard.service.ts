import { Injectable } from '@angular/core';
import {
    CanActivate,
    CanActivateChild,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { Logger } from 'ngo-base';
import { AuthenticationService } from 'ngo-login-client';
import { LoginService } from './login.service';
import { Fabric8RuntimeConsoleService } from './runtime-console/fabric8-runtime-console.service';

// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(
        protected auth: AuthenticationService,
        protected router: Router,
        protected logger: Logger,
        protected login: LoginService
    ) { }

    public canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        if (!this.auth.isLoggedIn()) {
            this.login.redirectToLogin(state.url);
            return Observable.of(false);
        } else {
            return Observable.of(true);
        }
    }

    public canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {
        return this.canActivate(route, state);
    }

}
