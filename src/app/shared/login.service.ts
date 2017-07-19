import { ErrorService } from '../error/error.service';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable, Inject } from '@angular/core';

import { Broadcaster } from 'ngo-base';
import { AuthenticationService } from 'ngo-login-client';

import { NotificationService, NotificationType } from 'patternfly-ng';

import { Keycloak } from '@ebondu/angular2-keycloak';

@Injectable()
export class LoginService {

  public static readonly REDIRECT_URL_KEY = 'redirectUrl';
  public static readonly DEFAULT_URL = '/_home';
  // URLs that the redirect should ignore
  public static readonly BANNED_REDIRECT_URLS = ['/'];
  public static readonly LOGIN_URL = '/';

  private authUrl: string;  // URL to web api

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(SYNC_API_URL) private apiUrl: string,
    private broadcaster: Broadcaster,
    private errorService: ErrorService,
    private authService: AuthenticationService,
    private notifications: NotificationService,
    private keycloak: Keycloak
  ) {
    // Removed ?link=true in favor of getting started page
    this.authUrl = apiUrl + 'login/authorize';
    this.broadcaster.on('authenticationError').subscribe(() => {
      this.authService.logout();
    });
    this.broadcaster.on('noFederatedToken').subscribe(() => {
      // Don't log out first time users from getting started as tokens may not exist
      if (this.router.url !== '/' && this.router.url.indexOf('_gettingstarted') === -1
        && this.router.url.indexOf('_update') === -1) {
        this.authService.logout();
      }
    });
  }

  public redirectToAuth() {
    Keycloak.login({});
  }

  public redirectAfterLogin() {
    let url = this._redirectUrl;
    if (!url || LoginService.BANNED_REDIRECT_URLS.indexOf(url) >= 0) {
      url = LoginService.DEFAULT_URL;
    }
    this.router.navigateByUrl(url);
  }

  public redirectToLogin(currentUrl: string) {
    console.log('Please login to access ' + currentUrl);
    this.redirectUrl = currentUrl;
    window.location.href = LoginService.LOGIN_URL;
  }

  public logout() {
    this.authService.logout();

    // Logout should be localted on apiUrl/logout?redirect=
    const redirect = this.apiUrl + 'logout?redirect=' + encodeURIComponent(window.location.origin);
  }

  public login() {
    if (this.authService.isLoggedIn()) {
      this.authService.onLogIn();
    }
  }

  public set redirectUrl(value: string) {
    if (value) {
      this.localStorage.set(LoginService.REDIRECT_URL_KEY, value);
    }
  }

  private get _redirectUrl(): string {
    let res = this.localStorage.get<string>(LoginService.REDIRECT_URL_KEY);
    this.localStorage.remove(LoginService.REDIRECT_URL_KEY);
    return res;
  }

}
