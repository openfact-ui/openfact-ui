import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { User, UserService } from '../ngx/ngx-login-client';

import { ExtUser } from './../getting-started/services/getting-started.service';

@Component({
  selector: 'cn-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit, OnDestroy {

  private subcriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit() {
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((user) => {
        const registrationCompleted: boolean = (user as ExtUser).attributes.registrationCompleted;
        if (!registrationCompleted) {
          this.router.navigateByUrl('/_gettingstarted');
        } else {
          this.router.navigateByUrl('/_home');
        }
      })
    );
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

}
