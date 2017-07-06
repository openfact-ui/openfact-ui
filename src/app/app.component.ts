import { LoginService } from './shared/login.service';
import { NotificationsService } from './shared/notifications.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AboutService } from './shared/about.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ofs-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ofs';

  showClose = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private about: AboutService,
    public notifications: NotificationsService,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion,
      '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      // this.loginService.login();
    });
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  handleClose($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

  handleViewingChange($event: any): void {
    this.notifications.actionSubject.next($event.action);
  }

}
