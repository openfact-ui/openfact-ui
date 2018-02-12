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
  authorized: boolean = false;

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

        this.authorized = this.getRequestParam('authorized') === 'true';
        if (this.authorized) {
          this.saveUser();
        }
      })
      .do(() => {
        this.routeToHomeIfCompleted();
      })
      .publish().connect();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  accept() {
    this.authorizeOffline(window.location.origin + '/_gettingstarted?authorized=true');
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
    let authorized = this.getRequestParam('authorized');
    return (authorized !== null || this.registrationCompleted === false);
  }

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param != undefined) {
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

  private redirectToAuth(url) {
    window.location.href = url;
  }

}
