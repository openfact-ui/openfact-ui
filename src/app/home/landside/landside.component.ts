import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { UserService } from '../../ngx-login-client';
import { Space, SpaceService } from '../../ngx-clarksnut';
import { SpacesService } from '../../ngx-clarksnut-impl/spaces.service';

@Component({
  selector: 'cn-landside',
  templateUrl: './landside.component.html',
  styleUrls: ['./landside.component.scss']
})
export class LandsideComponent implements OnInit, OnDestroy {

  spaces: Space[];
  recentlyViewedItems: Space[];

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private spacesService: SpacesService) {
    this.userService.loggedInUser
      .switchMap((user) => this.spaceService.getSpacesByUser(user.attributes.username))
      .do((spaces) => {
        this.spaces = spaces;
      }).publish().connect();

    this.spacesService.recent.subscribe((val) => {
      this.recentlyViewedItems = val;
    });
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
