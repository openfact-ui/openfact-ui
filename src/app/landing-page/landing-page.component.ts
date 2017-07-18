import { LoginService } from '../shared/login.service';
import { Broadcaster } from 'ngo-base';
import { Component, OnInit, HostBinding } from '@angular/core';

import { AuthenticationService } from 'ngo-login-client';

@Component({
  selector: 'alm-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  @HostBinding('class')
  public classes = 'app-component flex-container in-column-direction flex-grow-1';

  constructor(
    private broadcaster: Broadcaster,
    private loginService: LoginService,
    private authService: AuthenticationService) {
  }

  public ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loginService.redirectAfterLogin();
    }
  }

  public login() {
    this.loginService.redirectUrl = '/_gettingstarted';
    this.broadcaster.broadcast('login');
    this.loginService.login();
  }

}
