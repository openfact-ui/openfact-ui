import { Broadcaster } from 'ngo-base';
import { AuthenticationService } from 'ngo-login-client';
import { Spaces } from 'ngo-openfact-sync';

/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppState } from './app.service';

import { ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AboutService } from './shared/about.service';
import { NotificationsService } from './shared/notifications.service';
import { LoginService } from './shared/login.service';
import { BrandingService } from './shared/branding.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  constructor(
    private about: AboutService,
    private activatedRoute: ActivatedRoute,
    public notifications: NotificationsService,
    private loginService: LoginService,
    // Inject services that need to start listening
    private spaces: Spaces,
    private authService: AuthenticationService,
    private broadcaster: Broadcaster,
    private router: Router,
    private titleService: Title,
    private brandingService: BrandingService,
    private translate: TranslateService) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    let browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|es/) ? browserLang : 'en');
  }

  public ngOnInit() {
    console.log('Welcome to Openfact Sync!');
    console.log('This is', this.about.buildVersion, '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      this.loginService.login();
    });

    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        let title = event['title'] ? `${event['title']} - ${this.brandingService.name}` : this.brandingService.name;
        this.titleService.setTitle(title);
      });
  }

  public handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
