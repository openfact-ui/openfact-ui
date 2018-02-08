import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { Logger, Notification, NotificationType, Notifications } from '../ngx/ngx-base';
import { User, UserService, AuthenticationService } from '../ngx/ngx-login-client';
import { ExtUser, GettingStartedService } from './services/getting-started.service';
import { CLARKSNUT_MAIL_COLLECTOR_API_URL } from '../ngx/ngx-clarksnut';
import { KeycloakService } from '../keycloak-service/keycloak.service';

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

  private mailCollectorUrl: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private auth: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications,
    private keycloakService: KeycloakService,
    @Inject(CLARKSNUT_MAIL_COLLECTOR_API_URL) mailCollectorUrl: string) {
    this.mailCollectorUrl = mailCollectorUrl.endsWith('/') ? mailCollectorUrl + 'auth' : mailCollectorUrl + '/auth';
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

  accept() {
    this.authorizeOffline(window.location.origin + '/_gettingstarted?wait=true');
  }

  authorizeOffline(redirect: string): void {
    const tokenPromise: Promise<string> = this.keycloakService.getToken();
    const tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);
    tokenObservable.subscribe(token => {
      let parsedToken = jwt_decode(token);
      let url = `${this.mailCollectorUrl}/authorize_offline?`
        + 'redirect=' + redirect;
      this.redirectToAuth(url);
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

  private redirectToAuth(url) {
    window.location.href = url;
  }

}
