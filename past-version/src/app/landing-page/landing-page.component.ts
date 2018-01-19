import {Component, OnInit} from '@angular/core';
import {Broadcaster} from 'ngo-base';
import {AuthenticationService} from 'ngo-login-client';
import {LoginService} from '../shared/login.service';

@Component({
  host: {
    'class': 'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'ofs-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(private broadcaster: Broadcaster,
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
    this.loginService.redirectToAuth();
  }

}
