import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from '../../ngx/ngx-base';
import { User, UserService } from '../../ngx/ngx-login-client';
import { Space, SpaceService } from '../../ngx/ngx-clarksnut';
import { SpacesService } from '../../ngx-impl/ngx-clarksnut-impl/spaces.service';

@Component({
  selector: 'cn-landside',
  templateUrl: './landside.component.html',
  styleUrls: ['./landside.component.scss']
})
export class LandsideComponent implements OnInit, OnDestroy {

  loggedInUser: User;

  ownedSpaces: Space[] = [];
  collaboratedSpaces: Space[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService,
    private spacesService: SpacesService) {

    this.subscriptions.push(
      userService.loggedInUser
        .do((user) => {
          this.loggedInUser = user;
          this.initOwnedSpaces();
          this.initCollaboratedSpaces();
        })
        .publish().connect()
    );

    this.subscriptions.push(
      Observable.merge(
        this.broadcaster.on('spaceCreated'),
        this.broadcaster.on('spaceDeleted')
      ).subscribe((val) => {
        this.initOwnedSpaces();
        this.initCollaboratedSpaces();
      })
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  initOwnedSpaces() {
    this.spaceService.getOwnedSpacesByUserId('me').subscribe((val) => {
      this.ownedSpaces = val;
    });
  }

  initCollaboratedSpaces() {
    this.spaceService.getCollaboratedSpacesByUserId('me').subscribe((val) => {
      this.collaboratedSpaces = val;
    });
  }

  fetchMoreOwnedSpaces() {
    this.subscriptions.push(this.spaceService.getMoreOwnedSpaces().subscribe((val) => {
      this.ownedSpaces = this.ownedSpaces.concat(val);
    }, (err) => {
      console.log('Can not fetch more spaces');
    }));
  }

  fetchMoreCollaboratedpaces() {
    this.subscriptions.push(this.spaceService.getMoreCollaboratedSpaces().subscribe((val) => {
      this.collaboratedSpaces = this.collaboratedSpaces.concat(val);
    }, (err) => {
      console.log('Can not fetch more spaces');
    }));
  }

  editSpace(space: Space) {
    this.router.navigate(['/_spaces', space.id]);
  }

}
