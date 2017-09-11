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
    if (this.context && this.context.type && this.context.type.hasOwnProperty('menus')) {
      let foundPath = false;
      let menus = (this.context.type as MenuedContextType).menus;
      for (let n of menus) {
        // Clear the menu's active state
        n.active = false;
        if (this.menuCallbacks.has(n.path)) {
          this.menuCallbacks.get(n.path)(this).subscribe((val) => n.hide = val);
        }
        // lets go in reverse order to avoid matching
        // /namespace/space/create instead of /namespace/space/create/pipelines
        // as the 'Create' page matches to the 'Codebases' page
        let subMenus = (n.menus || []).slice().reverse();
        if (subMenus) {
          for (let o of subMenus) {
            // Clear the menu's active state
            o.active = false;
            if (!foundPath && o.fullPath === decodeURIComponent(this.router.url)) {
              foundPath = true;
              o.active = true;
              n.active = true;
            }
            if (this.menuCallbacks.has(o.path)) {
              this.menuCallbacks.get(o.path)(this).subscribe((val) => o.hide = val);
            }
          }
          if (!foundPath) {
            // lets check if the URL matches part of the path
            for (let o of subMenus) {
              if (!foundPath && decodeURIComponent(this.router.url).startsWith(o.fullPath + '/')) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path)) {
                this.menuCallbacks.get(o.path)(this).subscribe(val => o.hide = val);
              }
            }
          }
          if (!foundPath && this.router.routerState.snapshot.root.firstChild) {
            // routes that can't be correctly matched based on the url should use the parent path
            for (let o of subMenus) {
              // tslint:disable-next-line:max-line-length
              let parentPath = decodeURIComponent('/' + this.router.routerState.snapshot.root.firstChild.url.join('/'));
              if (!foundPath && o.fullPath === parentPath) {
                foundPath = true;
                o.active = true;
                n.active = true;
              }
              if (this.menuCallbacks.has(o.path)) {
                this.menuCallbacks.get(o.path)(this).subscribe((val) => o.hide = val);
              }
            }
          }
        } else if (!foundPath && n.fullPath === this.router.url) {
          n.active = true;
          foundPath = true;
        }
      }
    }
  }

  private checkContextUserEqualsLoggedInUser(): Observable<boolean> {
    return Observable.combineLatest(
      Observable.of(this.context).map((val) => val.user.id),
      this.userService.loggedInUser.map((val) => val.id),
      (a, b) => (a !== b)
    );
  }

}
