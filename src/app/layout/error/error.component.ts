import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ErrorService } from './error.service';

import { UserService, AuthenticationService } from '../../ngx/ngx-login-client';

@Component({
  selector: 'cn-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnDestroy {

  message = '';
  subscription: Subscription;
  hideBanner: boolean;
  spaceLink: string;
  userSubscription: Subscription;

  constructor(
    private errorService: ErrorService,
    router: Router,
    userService: UserService,
    authService: AuthenticationService) {
    this.subscription = this.errorService.update$.subscribe(
      (message) => {
        this.message = message;
      });

    this.userSubscription = userService.loggedInUser.subscribe((val) => {
      if (val.id) {
        this.spaceLink = '/' + val.attributes.username + '/_spaces';
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
