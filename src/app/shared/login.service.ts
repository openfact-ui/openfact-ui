import { Router } from '@angular/router';
import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Broadcaster, Notifications, Notification, NotificationType } from '../ngx/ngx-base';
import { UserService } from '../ngx/ngx-login-client';
import { CLARKSNUT_API_URL } from '../ngx/ngx-clarksnut';

import { ContextService } from '../ngx-impl/ngx-clarksnut-impl/context.service';
import { Navigation } from './../models/navigation';
import { ErrorService } from '../layout/error/error.service';


@Injectable()
export class LoginService {

  static readonly REDIRECT_URL_KEY = 'redirectUrl';
  static readonly DEFAULT_URL = '/_home';
  // URLs that the redirect should ignore
  static readonly BANNED_REDIRECT_URLS = ['/'];
  static readonly LOGIN_URL = '/';


  private authUrl: string;  // URL to web api

  constructor(
    private router: Router,
    @Inject(CLARKSNUT_API_URL) private apiUrl: string,
    private broadcaster: Broadcaster,
    private errorService: ErrorService,
    private contextService: ContextService,
    private notifications: Notifications,
    private userService: UserService
  ) {
    // Removed ?link=true in favor of getting started page
    this.authUrl = apiUrl + 'login/authorize';
  }

  redirectToAuth() {
    let authUrl = this.authUrl;
    if (authUrl.indexOf('?') < 0) {
      // lets ensure there's a redirect parameter to avoid WIT barfing
      authUrl += '?redirect=' + window.location.href;
    }
    window.location.href = authUrl;
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
    window.location.href = this.apiUrl + 'logout?redirect=' + encodeURIComponent(window.location.origin);
  }

  public login() {
    /*let query = window.location.search.substr(1);
    let result: any = {};
    query.split('&').forEach(function (part) {
      let item: any = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    if (result['error']) {
      this.notifications.message({ message: result['error'], type: NotificationType.DANGER } as Notification);
      // this.errorService.updateMessage('Error logging in');
      // this.router.navigate(['_error']);
    } else if (result['token_json']) {
      // Handle the case that this is a login
      this.authService.logIn(result['token_json']);

      // Navigate back to the current URL to clear up the query string
      this.router.navigateByUrl(this.router.url);
    } else if (this.authService.isLoggedIn()) {
      // Handle the case the user is already logged in
      this.authService.onLogIn();
    }*/
  }

  public set redirectUrl(value: string) {
    /*if (value) {
      this.localStorage.set(LoginService.REDIRECT_URL_KEY, value);
    }*/
  }

  private get _redirectUrl(): string {
    /*let res = this.localStorage.get<string>(LoginService.REDIRECT_URL_KEY);
    this.localStorage.remove(LoginService.REDIRECT_URL_KEY);
    return res;*/
    return null;
  }

}
