import { LoginService } from './shared/login.service';
import { SSO_API_URL, REALM } from 'ngo-login-client';
import { Keycloak } from '@ebondu/angular2-keycloak';
import { NotificationsService } from './shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Http } from '@angular/http';
import { AboutService } from './shared/about.service';

/**
 * Angular 2 decorators and services
 */
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public showClose = false;

  constructor(
    public appState: AppState,
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
    @Inject(SSO_API_URL) private ssoUrl: string,
    @Inject(REALM) private realm: string,
    private keycloak: Keycloak,
    private http: Http) {
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);

    console.log('Welcome to Openfact Sync!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, ' and was built on', this.about.buildTimestamp, ')');

    // Configure the Keycloak
    Keycloak.config = {
      url: this.ssoUrl + 'auth',
      realm: this.realm,
      clientId: 'openfact-public-client'
    };
    this.keycloak.init({
      checkLoginIframe: false,
      onLoad: 'check-sso'
    });

    this.activatedRoute.params.subscribe((a) => {
      this.loginService.login();
    });
  }

  public handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  public handleClose($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  public handleViewingChange($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
