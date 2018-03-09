import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { UserService } from './../ngx/ngx-login-client';
import { Context } from './../ngx/ngx-clarksnut';
import { ContextService } from './../ngx-impl/ngx-clarksnut-impl/context.service';

import { Navigation } from '../models/navigation';

@Injectable()
export class ProfileResolver implements Resolve<Context> {

  constructor(private userService: UserService, private contextService: ContextService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Context> {
    // Resolve the context
    return this.userService.loggedInUser.switchMap((userName) => {
      const url = state.url.replace(/_profile/, userName.attributes.username);
      return this.contextService
        .changeContext(Observable.of({
          url: url,
          user: userName.attributes.username,
          space: null
        } as Navigation)).first()
        .catch((err: any, caught: Observable<Context>) => {
          console.log(`Caught in resolver ${err}`);
          return Observable.throw(err);
        });
    }).take(1);
  }

}
