import {
  Component,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core';

import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { ErrorService } from './error.service';

import { UserService, AuthenticationService } from 'ngo-login-client';

@Component({
  selector: 'ofs-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnDestroy {

  public message: string = '';
  public subscription: Subscription;
  public hideBanner: boolean;
  public spaceLink: string;
  public userSubscription: Subscription;

  constructor(
    private errorService: ErrorService,
    router: Router,
    userService: UserService,
    authService: AuthenticationService) {
    this.subscription = this.errorService.update$.subscribe(
      (message) => {
        this.message = message;
      });

    if (authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe((val) => {
        if (val.id) {
          this.spaceLink = '/' + val.attributes.username + '/_spaces';
        }
      });
    } else {
      this.spaceLink = '/_home';
    }
  }

  public ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
