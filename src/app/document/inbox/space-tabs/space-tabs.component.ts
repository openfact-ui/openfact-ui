import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { User, UserService } from 'ngo-login-client';
import { Space, Context, SpaceService } from 'ngo-openfact-sync';
import { Notifications, Notification, NotificationType } from 'ngo-base';

import { ContextService } from './../../../shared/context.service';
import { ExtUser, GettingStartedService } from './../../../getting-started/services/getting-started.service';

@Component({
  selector: 'ofs-space-tabs',
  templateUrl: './space-tabs.component.html',
  styleUrls: ['./space-tabs.component.scss']
})
export class SpaceTabsComponent implements OnInit, OnDestroy {

  @Output() onChange = new EventEmitter<Space>();

  favoriteSpaces: Space[];
  ownedSpaces: Observable<Space[]>;
  collaboratedSpaces: Observable<Space[]>;

  selectedSpace: Space;

  private loggedInUser: User;
  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications) {
    this.subscriptions.push(
      this.userService.loggedInUser.subscribe(user => {
        this.loggedInUser = user;

        if (this.loggedInUser.attributes) {
          // Owned spaces
          let ownedSpaces = (this.loggedInUser as ExtUser).attributes.ownedSpaces || [];
          if (ownedSpaces.length > 0) {
            this.ownedSpaces = Observable.forkJoin((ownedSpaces as string[]).map((assignedId) => {
              return this.spaceService.getSpaceByAssignedId(this.loggedInUser.attributes.username, assignedId);
            }));
          } else {
            this.ownedSpaces = Observable.of([]);
          }

          // Collaborated spaces
          let collaboratedSpaces = (this.loggedInUser as ExtUser).attributes.collaboratedSpaces || [];
          if (collaboratedSpaces.length > 0) {
            this.collaboratedSpaces = Observable.forkJoin((collaboratedSpaces as string[]).map((assignedId) => {
              return this.spaceService.getSpaceByAssignedId(this.loggedInUser.attributes.username, assignedId);
            }));
          } else {
            this.collaboratedSpaces = Observable.of([]);
          }

          // Favorite spaces
          Observable.forkJoin(this.ownedSpaces, this.collaboratedSpaces).subscribe((allSpaces) => {
            let favoriteSpaces = (this.loggedInUser as ExtUser).attributes.favoriteSpaces || [];

            let spaces = [];
            allSpaces.forEach(elem => {
              elem.forEach(space => {
                if (favoriteSpaces.indexOf(space.attributes.assignedId) !== -1) {
                  spaces.push(space);
                }
              })
            });

            this.favoriteSpaces = spaces;
          });
        }
      })
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => {
      subs.unsubscribe();
    });
  }

  selectSpace(space: Space) {
    this.selectedSpace = space;
    this.onChange.emit(space);
  }

  updateFavoriteSpaces(spaces: Space[]) {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.favoriteSpaces = spaces.map(space => space.attributes.assignedId);

    this.gettingStartedService.update(profile).subscribe(() => {
      this.favoriteSpaces = spaces;
      this.notifications.message({
        message: `Favorite spaces updated!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, error => {
      this.notifications.message({
        message: `Failed to update favorite spaces"`,
        type: NotificationType.DANGER
      } as Notification);
    });
  }

}
