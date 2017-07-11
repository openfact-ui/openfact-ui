import { OnLogin } from './openfact-runtime-console/src/app/shared/onlogin.service';
import { Broadcaster } from 'ngo-base';
import { AuthenticationService } from 'ngo-login-client';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutService } from './shared/about.service';

/**
 * Angular 2 decorators and services
 */
import { Component, OnInit } from '@angular/core';
import { AppState } from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'ofs-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  showClose = false;

  constructor(
    public appState: AppState,
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
    // Inject services that need to start listening
    /*private spaces: Spaces,
    private analytics: AnalyticService,*/
    private onLogin: OnLogin,
    private authService: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router
  ) { }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);

    console.log('Welcome to OpenfactSync!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      this.loginService.login();
    });
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  handleClose($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  handleViewingChange($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
