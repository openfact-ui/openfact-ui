import { ExtProfile } from './services/ext-profile';
import { LoginService } from './../shared/login.service';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Keycloak } from '@ebondu/angular2-keycloak';
import { ExtUser } from './services/ext-user';
import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Logger, Broadcaster } from 'ngo-base';
import { AuthenticationService, UserService, User } from 'ngo-login-client';

import { GettingStartedService } from './services/getting-started.service';
import { ProviderService } from './services/provider.service';

import { NotificationService, Notification, NotificationType, Action } from 'patternfly-ng';
import { EmptyStateConfig, ActionConfig } from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'of-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  providers: [GettingStartedService, ProviderService]
})
export class GettingStartedComponent implements OnInit, OnDestroy {

  public loggedInUser: User;
  public registrationCompleted: boolean = true;
  public showGettingStarted: boolean = false;
  public subscriptions: Subscription[] = [];
  public username: string;

  public actionConfig = {
    primaryActions: [],
    moreActions: []
  } as ActionConfig;

  public emptyStateConfig = {
    actions: this.actionConfig,
    iconStyleClass: 'pficon-storage-domain',
    info: '' +
    'Welcome to Openfact Sync! To get started you will need to connect your' +
    ' Google Gmail and/or Microsoft Outlook accounts.',
    helpLink: {
      text: 'Do you agree to collaborate with your own information?'
    },
    title: 'Getting started in Openfact Sync'
  } as EmptyStateConfig;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthenticationService,
    private gettingStartedService: GettingStartedService,
    private loginService: LoginService,
    private notifications: NotificationService) {
  }

  public ngOnInit() {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;

        this.actionConfig.primaryActions = [];
        this.actionConfig.moreActions = [];

        // Empy State Config
        if (!this.registrationCompleted) {
          if (!this.authService.isOfflineToken()) {
            this.actionConfig.primaryActions = [{
              id: 'acceptConditions',
              title: 'Yes',
              tooltip: 'You Accept to share your information with us.'
            }, {
              id: 'rejectConditions',
              title: 'No',
              tooltip: 'You Reject to share your information with us.',
              styleClass: 'btn-default'
            }];
          } else {
            this.saveOfflineTokenAndRegistrationComplete();
          }
        }
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

  public handleAction($event: Action): void {
    if ($event.id === 'acceptConditions') {
      this.loginService.redirectToAuth({
        scope: 'offline_access'
      });
    } else if ($event.id === 'rejectConditions') {
      this.saveRegistrationComplete();
    } else {
      console.log('Invalid Action');
    }
  }

  /**
   * Helpfer to route to home page
   */
  public routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  public saveRegistrationComplete() {
    this.updateUser({
      registrationCompleted: true
    } as ExtProfile);
  }

  public saveOfflineTokenAndRegistrationComplete() {
    this.updateUser({
      registrationCompleted: true,
      contextInformation: {
        offlineToken: this.authService.getRefreshToken()
      }
    } as ExtProfile);
  }

  // Private

  private updateUser(profile: ExtProfile) {
    this.subscriptions.push(this.gettingStartedService.updateCurrentUser(profile).subscribe(
      (user) => {
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
        this.loggedInUser = user;

        // Since we allow the user to change their info 
        // then we should tell them they did
        this.notifications.message(
          NotificationType.SUCCESS,
          'Success',
          'User updated!',
          false,
          null,
          null);

        this.routeToHomeIfCompleted();
      },
      (error) => {
        if (error.status === 403) {
          this.handleError('User cannot be updated more than once', NotificationType.WARNING);
        } else if (error.status === 409) {
          this.handleError('User have already been configure', NotificationType.DANGER);
        } else {
          this.handleError('Failed to update username', NotificationType.DANGER);
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
   * Helpfer to route to home page if getting started is completed
   */
  private routeToHomeIfCompleted(): void {
    // Ensure subscription doesn't route to home should tokens be updated before ngOnDestroy
    if (this.isGettingStartedPage() && !this.isUserGettingStarted()) {
      this.routeToHome();
    }
  }

  private handleError(error: string, type: string) {
    this.notifications.message(type, 'Error', error, false, null, null);
  }

}
