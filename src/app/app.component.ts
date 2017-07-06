import { AuthenticationService } from 'ngx-login-client';
import { OnLogin } from './openfact-runtime-console';
import { Broadcaster } from 'ngx-base';
import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AboutService } from './shared/about.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'ofs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ofs';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private about: AboutService,
    public notifications: NotificationsService,
    private loginService: LoginService,
    // Inject services that need to start listening
    // private spaces: Spaces,
    // private analytics: AnalyticService,
    private onLogin: OnLogin,
    private authService: AuthenticationService,
    private broadcaster: Broadcaster
  ) { }

  ngOnInit() {

  }

}
