import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
    renderer: Renderer2,
    @Inject(DOCUMENT) document: Document,
    private router: Router,
    private userService: UserService) {
    renderer.removeClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
    this.subcriptions.push(
      this.userService.loggedInUser.subscribe((user) => {
        const registrationCompleted: boolean = (user as ExtUser).attributes.registrationCompleted;
        if (!registrationCompleted) {
          this.router.navigateByUrl('/_gettingstarted');
        }
      })
    );
  }

  ngOnDestroy() {
    this.subcriptions.forEach(val => val.unsubscribe());
  }

}
