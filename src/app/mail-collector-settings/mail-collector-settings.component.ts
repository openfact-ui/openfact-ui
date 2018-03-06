import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { User, UserService } from '../ngx/ngx-login-client';
import {
  UserService as UserMailCollectorService,
  User as UserMailCollector,
  LinkService
} from '../ngx/ngx-clarksnut-mail-collector';
import { Logger, Notification, Notifications, NotificationType, NotificationAction } from '../ngx/ngx-base';

import { ExtUser, GettingStartedService } from './../getting-started/services/getting-started.service';

@Component({
  selector: 'cn-mail-collector-settings',
  templateUrl: './mail-collector-settings.component.html',
  styleUrls: ['./mail-collector-settings.component.scss']
})
export class MailCollectorSettingsComponent implements OnInit, OnDestroy {

  username: string;
  loggedInUser: User;
  registrationCompleted = true;

  userMailCollector: UserMailCollector;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private userMailCollectorService: UserMailCollectorService,
    private linkService: LinkService,
    private notifications: Notifications,
    private gettingStartedService: GettingStartedService, ) {
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userService.loggedInUser
        .map((user) => {
          this.loggedInUser = user;
          this.username = this.loggedInUser.attributes.username;
          this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
        })
        .publish().connect()
    );

    this.subscriptions.push(
      this.userMailCollectorService.loggedInUser
        .map((user) => {
          this.userMailCollector = user;
        })
        .publish().connect()
    );

    const linked = this.getRequestParam('linked');
    if (linked) {
      this.notifications.message({
        message: 'Broker successfully linked',
        type: NotificationType.SUCCESS
      } as Notification);

      this.saveUser();
      this.router.navigate(['_mailcollectorsettings'], { queryParams: {} });
    }

    const error = this.getRequestParam('error');
    if (error) {
      let message = `Could not process your request due to (${error}).`;
      let primaryAction: NotificationAction;
      if (error === 'already_registered') {
        message = message + 'A possible solution to this is open the next link and remove access to Clarksnut and retry again.';
        primaryAction = {
          id: 'google',
          name: 'My Account',
          title: 'My Google Account'
        } as NotificationAction;
      }

      this.notifications.message({
        message: message,
        type: NotificationType.DANGER,
        primaryAction: primaryAction
      } as Notification)
        .filter((action) => action.id === primaryAction.id)
        .subscribe((action) => {
          window.open('https://myaccount.google.com/u/1/permissions');
        });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  createCollector() {
    const redirect = window.location.origin + '/_mailcollectorsettings?linked=true';
    this.linkService.addManualBroker('google', redirect);
  }

  goHome() {
    this.saveUser();
    this.router.navigate(['/_home']);
  }

  saveUser() {
    const profile = this.gettingStartedService.createTransientProfile();
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
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    const param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param !== undefined) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
