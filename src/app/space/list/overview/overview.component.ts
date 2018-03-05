import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Broadcaster } from '../../../ngx/ngx-base';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { Space, SpaceService } from '../../../ngx/ngx-clarksnut';

@Component({
  selector: 'cn-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  user: User;
  spaces: Space[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService
  ) {
    // this.subscriptions.push(
    //   Observable.merge(
    //     this.userService.loggedInUser.do((user) => this.user = user),
    //     this.broadcaster.on('spaceCreated'),
    //     this.broadcaster.on('spaceDeleted')
    //   ).subscribe((val) => {
    //     this.spaceService.getSpacesByUserId(this.user.id, 'owner', 5).subscribe((val) => {
    //       this.spaces = val;
    //     });
    //   })
    // );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  onClickChild(event) {
    event.preventDefault();
    event.stopPropagation();
  }

}
