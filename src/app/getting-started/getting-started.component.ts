import { Observable } from 'rxjs/Rx';
import { ExtProfile } from './services/ext-profile';
import { LoginService } from './../shared/login.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Keycloak } from '@ebondu/angular2-keycloak';
import { ExtUser } from './services/ext-user';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Logger, Broadcaster } from 'ngo-base';
import { AuthenticationService, UserService, User, SSO_API_URL, REALM } from 'ngo-login-client';

import { GettingStartedService } from './services/getting-started.service';
import { ProviderService } from './services/provider.service';

import { NotificationService, Notification, NotificationType, Action } from 'patternfly-ng';
import { EmptyStateConfig, ActionConfig } from 'patternfly-ng';

@Component({
  selector: 'of-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  providers: [GettingStartedService, ProviderService]
})
export class GettingStartedComponent implements OnInit, OnDestroy {

  public googleLinked: boolean = false;
  public microsoftLinked: boolean = false;

  public loggedInUser: User;
  public registrationCompleted: boolean = true;
  public showGettingStarted: boolean = false;
  public subscriptions: Subscription[] = [];
  public username: string;
  public usernameInvalid: boolean = false;
  public refreshToken: any;
  public isRefreshTokenOffline: boolean = false;

  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private userService: UserService,
    private authService: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private loginService: LoginService,
    private notifications: NotificationService,
    @Inject(SSO_API_URL) private ssoUrl: string,
    @Inject(REALM) private realm: string) {
  }

  public ngOnInit() {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      })
      .switchMap(() => {
        if (this.authService.isLoggedIn()) {
          this.refreshToken = this.authService.getRefreshToken();
          this.isRefreshTokenOffline = this.authService.isRefreshTokenOffline();
          return this.authService.getGoogleToken();
        } else {
          return this.broadcaster.on('loggedin').map(() => {
            this.refreshToken = this.authService.getRefreshToken();
            this.isRefreshTokenOffline = this.authService.isRefreshTokenOffline();
            return this.authService.getGoogleToken();
          });
        }
      })
      .do(() => {
        if (this.isRefreshTokenOffline) {
          this.saveUserToken(false);
        }
      })
      .map((token) => {
        this.googleLinked = (token !== undefined && token.length !== 0);
      })
      .switchMap(() => this.authService.getMicrosoftToken())
      .map((token) => {
        this.microsoftLinked = (token !== undefined && token.length !== 0);
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

  public ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /**
   * Helper to test if connect accounts button should be disabled
   *
   * @returns {boolean}
   */
  get isConnectAccountsDisabled(): boolean {
    return (this.googleLinked && this.microsoftLinked);
  }

  /**
   * Helper to test if the successful state panel should be shown
   *
   * @returns {boolean} If the user has completed the getting started page
   */
  get isSuccess(): boolean {
    return (this.registrationCompleted);
  }

  /**
   * Helper to test if username button should be disabled
   *
   * @returns {boolean}
   */
  get isUsernameDisabled(): boolean {
    return this.registrationCompleted;
  }

  public connectAccount(idp: string): void {
    window.open(this.ssoUrl + 'auth/realms/' + this.realm
      + '/account/identity?referrer=security-admin-console&referrer_uri='
      + encodeURIComponent(window.location.origin + '/_gettingstarted'), '_blank');
  }

  /**
   * Helpfer to route to home page
   */
  public routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  public requestOfflineToken(): void {
    this.loginService.redirectToAuth({
      scope: 'offline_access',
      redirectUri: window.location.origin + '/_gettingstarted?wait=true'
    });
  }

  /**
   * Save user
   */
  public saveUserToken(redirect: boolean) {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;
    profile.registrationCompleted = true;
    profile.refreshToken = this.isRefreshTokenOffline ? this.refreshToken : null;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe((user) => {
      this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      this.loggedInUser = user;
    }, (error) => {
      this.username = this.loggedInUser.attributes.username;
      if (error.status === 403) {
        this.handleError('User cannot be updated more than once', NotificationType.WARNING);
      } else if (error.status === 409) {
        this.handleError('User already exists', NotificationType.DANGER);
      } else {
        this.handleError('Failed to update user', NotificationType.DANGER);
      }
    }));

    if (redirect) {
      this.routeToHome();
    }
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)'))
      .exec(window.location.search);
    if (param != null) {
      return decodeURIComponent(param[1]);
    }
    return null;
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
    let wait = this.getRequestParam('wait');
    return !(wait === null && this.registrationCompleted === true);
  }

  /**
   * Helper to test if username is valid
   *
   * @returns {boolean}
   */
  private isUsernameValid(): boolean {
    // Dot and @ characters are valid
    return (this.username !== undefined
      && this.username.trim().length !== 0
      && this.username.trim().length < 63
      && this.username.trim().indexOf('-') !== 0
      && this.username.trim().indexOf('_') !== 0);
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

  private handleError(error: string, type: string) {
    this.notifications.message(type, 'Error', error, false, null, []);
  }

}
