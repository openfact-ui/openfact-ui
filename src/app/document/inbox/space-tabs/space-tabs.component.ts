import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  TemplateRef
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

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

  bsModalRef: BsModalRef;

  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private spaceService: SpaceService,
    private gettingStartedService: GettingStartedService) {
    this.subscriptions.push(
      this.userService.loggedInUser.subscribe(loggedInUser => {
        if (loggedInUser.attributes) {
          // Owned spaces
          let ownedSpaces = (loggedInUser as ExtUser).attributes.ownedSpaces || [];
          if (ownedSpaces.length > 0) {
            this.ownedSpaces = Observable.forkJoin((ownedSpaces as string[]).map((assignedId) => {
              return this.spaceService.getSpaceByAssignedId(loggedInUser.attributes.username, assignedId);
            }));
          } else {
            this.ownedSpaces = Observable.of([]);
          }

          // Collaborated spaces
          let collaboratedSpaces = (loggedInUser as ExtUser).attributes.collaboratedSpaces || [];
          if (collaboratedSpaces.length > 0) {
            this.collaboratedSpaces = Observable.forkJoin((collaboratedSpaces as string[]).map((assignedId) => {
              return this.spaceService.getSpaceByAssignedId(loggedInUser.attributes.username, assignedId);
            }));
          } else {
            this.collaboratedSpaces = Observable.of([]);
          }

          // Favorite spaces
          this.subscriptions.push(
            Observable.forkJoin(this.ownedSpaces, this.collaboratedSpaces).subscribe((allSpaces) => {
              let favoriteSpaces = (loggedInUser as ExtUser).attributes.favoriteSpaces || [];

              let spaces = [];
              allSpaces.forEach(elem => {
                elem.forEach(space => {
                  if (favoriteSpaces.indexOf(space.attributes.assignedId) !== -1) {
                    spaces.push(space);
                  }
                })
              });

              this.favoriteSpaces = spaces;
            })
          );
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

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template, {
      keyboard: false,
      ignoreBackdropClick: true
    });
  }

  selectSpace(space: Space) {
    this.selectedSpace = space;
    this.onChange.emit(space);
  }

  onFavoriteSpacesChange(spaces: Space[]) {
    let profile = this.gettingStartedService.createTransientProfile();
    profile.favoriteSpaces = spaces.map(space => space.attributes.assignedId);

    this.gettingStartedService.update(profile).subscribe(() => {
      this.favoriteSpaces = spaces;
    }, error => {
      console.log('Could not update favorite spaces:');
    });
  }

}
