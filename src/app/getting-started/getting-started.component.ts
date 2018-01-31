import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Logger, Notification, NotificationType, Notifications } from '../ngx/ngx-base';
import { User, UserService, AuthenticationService } from '../ngx/ngx-login-client';
import { ExtUser, GettingStartedService } from './services/getting-started.service';

@Component({
  selector: 'cn-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  username: string;
  loggedInUser: User;
  registrationCompleted: boolean = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private auth: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications) {
  }

  ngOnInit() {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      })
      .publish().connect();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  reject() {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;
    profile.registrationCompleted = true;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(
      (user) => {
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
        this.loggedInUser = user;
        this.router.navigate(['/_home']);
      },
      (error) => {
        if (error.status === 403) {
          this.handleError('User cannot be updated more than once', NotificationType.WARNING);
        } else if (error.status === 409) {
          this.handleError('User already exists', NotificationType.DANGER);
        } else {
          this.handleError('Failed to update User', NotificationType.DANGER);
        }
      }));
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

}
