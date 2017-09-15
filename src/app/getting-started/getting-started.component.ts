import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

import {Logger, Notification, NotificationType, Notifications} from 'ngo-base';
import {AuthenticationService, UserService, User} from 'ngo-login-client';

import {ExtUser, GettingStartedService} from './services/getting-started.service';
import {ProviderService} from './services/provider.service';
import {OpenfactUIConfig} from '../shared/config/openfact-ui-config';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {pathJoin} from '../../a-runtime-console/kubernetes/model/utils';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  providers: [GettingStartedService, ProviderService]
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  public authGoogle: boolean = false;
  public authMicrosoft: boolean = false;
  public googleLinked: boolean = false;
  public microsoftLinked: boolean = false;

  public loggedInUser: User;
  public registrationCompleted: boolean = true;
  public showGettingStarted: boolean = false;
  public subscriptions: Subscription[] = [];
  public username: string;
  public usernameInvalid: boolean = false;

  constructor(private auth: AuthenticationService,
              private gettingStartedService: GettingStartedService,
              private logger: Logger,
              private openfactUIConfig: OpenfactUIConfig,
              private http: Http,
              private providerService: ProviderService,
              private notifications: Notifications,
              private router: Router,
              private userService: UserService) {
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public ngOnInit(): void {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      })
      .switchMap(() => this.auth.getGoogleToken())
      .map((token) => {
        this.googleLinked = (token !== undefined && token.length !== 0);
      })
      .switchMap(() => this.auth.getMicrosoftToken())
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

  /**
   * Helper to test if connect accounts button should be disabled
   *
   * @returns {boolean}
   */
  get isConnectAccountsDisabled(): boolean {
    return !(this.authGoogle && !this.googleLinked || this.authMicrosoft && !this.microsoftLinked)
      || (this.googleLinked && this.microsoftLinked);
  }

  /**
   * Helper to test if the successful state panel should be shown
   *
   * @returns {boolean} If the user has completed the getting started page
   */
  get isSuccess(): boolean {
    return (this.registrationCompleted && this.googleLinked && this.microsoftLinked);
  }

  /**
   * Helper to test if username button should be disabled
   *
   * @returns {boolean}
   */
  get isUsernameDisabled(): boolean {
    return this.registrationCompleted;
  }

  // Actions

  /**
   * Link GitHub and/or OpenShift accounts
   */
  public connectAccounts(): void {
    if (this.authGoogle && !this.googleLinked && this.authMicrosoft && !this.microsoftLinked) {
      this.providerService.linkAll(window.location.origin + '/_gettingstarted?wait=true');
    } else if (this.authGoogle && !this.googleLinked) {
      this.providerService.linkGoogle(window.location.origin + '/_gettingstarted?wait=true');
    } else if (this.authMicrosoft && !this.microsoftLinked) {
      this.providerService.linkMicrosoft(window.location.origin + '/_gettingstarted?wait=true');
    }
  }

  /**
   * Helpfer to route to home page
   */
  public routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  /**
   * Save username
   */
  public saveUser(): void {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;
    profile.registrationCompleted = true;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe((user) => {
      this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      this.loggedInUser = user;
    }, (error) => {
      this.username = this.loggedInUser.attributes.username;
      if (error.status === 403) {
        this.handleError('Username cannot be updated more than once', NotificationType.WARNING);
      } else if (error.status === 409) {
        this.handleError('Username already exists', NotificationType.DANGER);
      } else {
        this.handleError('Failed to update username', NotificationType.DANGER);
      }
    }));
  }

  public saveUserOffline(): void {
    this.providerService.linkOffline(window.location.origin + '/_gettingstarted?wait=true');
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
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
    return !(wait === null && this.registrationCompleted === true
      && this.googleLinked === true && this.microsoftLinked === true);
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

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

}
