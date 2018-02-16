import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Logger, Notification, NotificationType, Notifications } from '../ngx/ngx-base';
import { User, UserService } from '../ngx/ngx-login-client';
import { ExtUser, GettingStartedService } from './services/getting-started.service';

import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'cn-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss']
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  username: string;
  loggedInUser: User;
  registrationCompleted: boolean = true;

  showGettingStarted: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications, ) {
  }

  ngOnInit() {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      })
      .do(() => {
        this.routeToHomeIfCompleted();
      })
      .publish().connect();

    // Page is hidden by default to prevent flashing, but must show if tokens cannot be obtained.
    setTimeout(() => {
      if (this.isUserGettingStarted()) {
        this.showGettingStarted = true;
      }
    }, 1000);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  accept() {
    this.router.navigate(['/_mailcollectorsettings']);
  }

  reject() {
    this.saveUser();
    this.router.navigate(['/_home']);
  }

  saveUser() {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;
    profile.registrationCompleted = true;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(
      (user) => {
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
        this.loggedInUser = user;
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

  /**
   * Helpfer to route to home page
   */
  routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  /**
   * Helpfer to route to home page if getting started is completed
   */
  private routeToHomeIfCompleted(): void {
    // Ensure subscription doesn't route to home should tokens be updated before ngOnDestroy
    if (this.isGettingStartedPage() && !this.isUserGettingStarted()) {
      this.routeToHome();
    }
  }

  /**
  * Helper to determin if we're on the getting started page
  *
  * @returns {boolean} True if the getting started page is shown
  */
  private isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

  /**
   * Helper to determine if getting started page should be shown or forward to the home page.
   *
   * @returns {boolean}
   */
  private isUserGettingStarted(): boolean {
    return (this.registrationCompleted === false);
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

}
