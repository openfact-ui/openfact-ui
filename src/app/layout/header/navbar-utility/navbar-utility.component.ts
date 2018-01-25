import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { User } from './../../../ngx-login-client';
import { UserService } from '../../../ngx-login-client';

import { KeycloakService } from '../../../keycloak-service/keycloak.service';

@Component({
  selector: 'cn-navbar-utility',
  templateUrl: './navbar-utility.component.html',
  styleUrls: ['./navbar-utility.component.scss']
})
export class NavbarUtilityComponent implements OnInit, OnDestroy {

  user: User;
  private subcriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private keycloakService: KeycloakService
  ) {
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

  manageAccount() {
    this.keycloakService.manageAccount();
  }

  logout() {
    this.keycloakService.logout();
  }

}
