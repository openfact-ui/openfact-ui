import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngo-openfact-sync';
import { UserService, User } from 'ngo-login-client';

export class Activity {
  public what: string;
  public when: string;
}

// tslint:disable-next-line:max-classes-per-file
@Component({
  selector: 'ofs-activity',
  templateUrl: './activity.component.html'
})
export class ActivityComponent implements OnDestroy, OnInit {

  public activityItems: any[] = [];
  public context: Context;
  public loggedInUser: User;
  public subscriptions: Subscription[] = [];

  constructor(
    private contexts: Contexts,
    private userService: UserService,
    private router: Router) {
    this.subscriptions.push(contexts.current.subscribe((val) => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe((user) => {
      this.loggedInUser = user;
    }));
  }

  public ngOnInit(): void {
    /* Todo: "WorkItems, WorkItemLinks and Comments have history -- not in API, but it's stored in the backend"
    this.activityItems = [{
      what: this.context.user.attributes.username + " added BallonPopGame space",
      when: "Just now"
    },{
      what: this.context.user.attributes.username + " started Iteration 23",
      when: "Just now"
    },{
      what: this.context.user.attributes.username + " tagged user2 in a comment on Iteration 23 that is a long string",
      when: "Just now"
    },{
      what:  + "PTNFLY-2100 was assigned to " + this.context.user.attributes.username,
      when: "Just now"
    }] as Activity[];
    */
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Actions

  public routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }
}
