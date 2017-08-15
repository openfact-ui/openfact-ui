import { Keycloak } from '@ebondu/angular2-keycloak';
import { LoginService } from './../shared/login.service';
import { Broadcaster } from 'ngo-base';
import { User, UserService } from 'ngo-login-client';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Subscription, Observable } from 'rxjs';

import { ContextService } from '../shared/context.service';
import { MenuedContextType } from './menued-context-type';
import { Navigation } from '../models/navigation';
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

  public loggedInUser: User;
  private _loggedInUserSubscription: Subscription;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    private broadcaster: Broadcaster,
    public loginService: LoginService) {

    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.broadcaster.broadcast('navigate', { url: val.url } as Navigation);
        this.updateMenus();
      }
    });

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
    console.log('init');
  }

  public ngOnDestroy() {
    console.log('destroy');
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

  private updateMenus() {
    console.log('updating menu');
  }

  get isGettingStartedPage(): boolean {
    return (this.router.url.indexOf('_gettingstarted') !== -1);
  }

}
