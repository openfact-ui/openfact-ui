import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

import { User, UserService } from '../../ngx/ngx-login-client';
import { Space } from '../../ngx/ngx-clarksnut';

type MenuHiddenCallback = (headerComponent: HeaderComponent) => Observable<boolean>;

@Component({
  selector: 'cn-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  user: User;
  space: Space;
  private subcriptions: Subscription[] = [];

  isMobileMenuShow = false;

  constructor(private userService: UserService) {
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.user = val;
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

  toggleMobileNav() {
    this.isMobileMenuShow = !this.isMobileMenuShow;
  }

}
