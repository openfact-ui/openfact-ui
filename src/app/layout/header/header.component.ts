import { Keycloak } from '@ebondu/angular2-keycloak';
import { Broadcaster, Logger } from 'ngo-base';
import { User, UserService } from 'ngo-login-client';
import { ContextType, Context, Contexts } from 'ngo-openfact-sync';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { LoginService } from '../../shared/login.service';
import { ContextService } from '../shared/context.service';
import { MenuedContextType } from './menued-context-type';
import { Navigation } from '../../models/navigation';
import { DummyService } from '../shared/dummy.service';

interface MenuHiddenCallback {
  (headerComponent: HeaderComponent): Observable<boolean>;
}

@Component({
  selector: 'ofs-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public title = 'Sync';
  public imgLoaded: Boolean = false;
  public statusListVisible = false;

  public isIn = false;   // store state

  public menuCallbacks = new Map<String, MenuHiddenCallback>([
    [
      // tslint:disable-next-line:only-arrow-functions
      '_settings', function (headerComponent) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ],
    [
      // tslint:disable-next-line:only-arrow-functions
      '_resources', function (headerComponent) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ],
    [
      // tslint:disable-next-line:only-arrow-functions
      'settings', function (headerComponent) {
        return headerComponent.checkContextUserEqualsLoggedInUser();
      }
    ]
  ]);

  public recent: Context[];
  public loggedInUser: User;
  private _context: Context;
  private _defaultContext: Context;
  private _loggedInUserSubscription: Subscription;
  private plannerFollowQueryParams: Object = {};
  private eventListeners: any[] = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    private logger: Logger,
    public loginService: LoginService,
    private broadcaster: Broadcaster,
    private contexts: Contexts) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
        this.updateMenus();
      }
    });
    contexts.current.subscribe((val) => {
      this._context = val;
      this.updateMenus();
    });
    contexts.default.subscribe((val) => {
      this._defaultContext = val;
    });
    contexts.recent.subscribe((val) => this.recent = val);

    // Currently logged in user
    this.userService.loggedInUser.subscribe(
      (val) => {
        if (val.id) {
          this.loggedInUser = val;
        } else {
          this.resetData();
          this.loggedInUser = null;
        }
      }
    );
  }

  public ngOnInit() {
    this.listenToEvents();
  }

  public ngOnDestroy() {
    this.eventListeners.forEach((e) => e.unsubscribe());
  }

  public listenToEvents() {
    this.eventListeners.push(
      this.route.queryParams.subscribe((params) => {
        this.plannerFollowQueryParams = {};
        if (Object.keys(params).indexOf('iteration') > -1) {
          this.plannerFollowQueryParams['iteration'] = params['iteration'];
        }
      })
    );
  }

  public toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  public onStatusListVisible = (flag: boolean) => {
    this.statusListVisible = flag;
  }

  public login() {
    this.broadcaster.broadcast('login');
    this.loginService.redirectToAuth();
  }

  public account() {
    Keycloak.accountManagement({});
  }

  public logout() {
    this.loginService.logout();
  }

  public onImgLoad() {
    this.imgLoaded = true;
  }

  private resetData(): void {
    this.imgLoaded = false;
  }

  get context(): Context {
    if (this.router.url === '/_home') {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

  get isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

  private updateMenus() {
    console.log('updating menu');
  }

  private checkContextUserEqualsLoggedInUser(): Observable<boolean> {
    return Observable.combineLatest(
      Observable.of(this.context).map((val) => val.user.id),
      this.userService.loggedInUser.map((val) => val.id),
      (a, b) => (a !== b)
    );
  }

}
