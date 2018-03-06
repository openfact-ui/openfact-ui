import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '@ngx-translate/core';

import { User, UserService } from '../../ngx/ngx-login-client';
import { Contexts, Context, Space } from '../../ngx/ngx-clarksnut';

type MenuHiddenCallback = (headerComponent: HeaderComponent) => Observable<boolean>;

@Component({
  selector: 'cn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  loggedInUser: User;
  private _context: Context;
  private subcriptions: Subscription[] = [];

  isMobileMenuShow = false;

  constructor(
    private userService: UserService,
    private contexts: Contexts) {
    this.subcriptions.push(
      userService.loggedInUser.subscribe((val) => this.loggedInUser = val),
      contexts.current.subscribe((val) => this._context = val)
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subcriptions.forEach((val) => val.unsubscribe());
  }

  get context(): Context {
    return this._context;
  }

  toggleMobileNav() {
    this.isMobileMenuShow = !this.isMobileMenuShow;
  }

}
