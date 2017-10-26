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

import { Modal } from 'ngx-modal';
import { User, UserService, Profile } from 'ngo-login-client';
import { Space, Context, SpaceService } from 'ngo-openfact-sync';
import { Notifications, Notification, NotificationType } from 'ngo-base';

import { ContextService } from './../../../shared/context.service';
import { GettingStartedService, ExtUser } from './../../../getting-started/services/getting-started.service';

@Component({
  host: {
    'class': 'add-dialog'
  },
  selector: 'add-spaces-dialog',
  templateUrl: './add-spaces-dialog.component.html',
  styleUrls: ['./add-spaces-dialog.component.scss']
})
export class AddSpacesDialogComponent implements OnInit, OnDestroy {

  @Input() host: Modal;
  @Input() favoriteSpaces: Space[];
  @Input() ownedSpaces: Space[];
  @Input() collaboratedSpaces: Space[];
  @Output() onChange = new EventEmitter<Space[]>();

  private selectedSpaces: Space[] = [];

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  /*clearAndRefreshSelections() {
    this.selectedFavoriteSpaces = [];
    this.ownedSpaces.forEach(space => {
      if (this.favoriteSpaces.indexOf(space.attributes.assignedId) !== -1) {
        this.selectedFavoriteSpaces.push(space);
      }
    });
    this.collaboratedSpaces.forEach(space => {
      if (this.favoriteSpaces.indexOf(space.attributes.assignedId) !== -1) {
        this.selectedFavoriteSpaces.push(space);
      }
    });
  }*/

  isSpaceSelected(space: Space) {
    return this.favoriteSpaces
      .map(s => s.attributes.assignedId)
      .indexOf(space.attributes.assignedId) > -1;
  }

  onOwnedChange(space: Space, isChecked: boolean) {
    if (isChecked) {
      this.selectedSpaces.push(space);
    } else {
      let index = this.selectedSpaces.findIndex(s => s.attributes.assignedId === space.attributes.assignedId)
      this.selectedSpaces.splice(index, 1);
    }
  }

  /*updateSpaces() {
    this.host.close();

    let profile = this.gettingStartedService.createTransientProfile();
    profile.favoriteSpaces = this.selectedFavoriteSpaces.map(space => space.attributes.assignedId);

    this.gettingStartedService.update(profile).subscribe(() => {
      this.onChange.emit(this.selectedFavoriteSpaces);
      this.notifications.message({
        message: `Experimental features enabled!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, error => {
      this.notifications.message({
        message: `Failed to update profile"`,
        type: NotificationType.DANGER
      } as Notification);
    });
  }*/

  cancel() {
    this.host.close();
    this.selectedSpaces = [];
  }

}
