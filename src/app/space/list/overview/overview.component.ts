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
  ownedSpaces: Space[] = [];
  collaboratedSpaces: Space[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService
  ) {
    this.subscriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.user = val;
        this.spaceService.getOwnedSpacesByUserId('me').subscribe((spaces) => {
          this.ownedSpaces = spaces;
        });
        this.spaceService.getCollaboratedSpacesByUserId('me').subscribe((spaces) => {
          this.collaboratedSpaces = spaces;
        });
      })
    );
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
