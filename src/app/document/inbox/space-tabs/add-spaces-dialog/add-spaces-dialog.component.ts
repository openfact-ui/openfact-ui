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

import { BsModalRef } from 'ngx-bootstrap/modal';
import { User, UserService, Profile } from '../../../../ngx-login-client';
import { Space, Context, SpaceService } from '../../../../ngx-clarksnut';
import { Notifications, Notification, NotificationType } from '../../../../ngx-base';

@Component({
  selector: 'add-spaces-dialog',
  templateUrl: './add-spaces-dialog.component.html',
  styleUrls: ['./add-spaces-dialog.component.scss']
})
export class AddSpacesDialogComponent implements OnInit, OnDestroy {

  @Input() host: BsModalRef;

  @Input() favoriteSpaces: Space[];
  @Input() ownedSpaces: Space[];
  @Input() collaboratedSpaces: Space[];

  @Output() onChange = new EventEmitter<Space[]>();

  selectedSpaces: string[] = [];

  constructor(
    private userService: UserService,
    private spaceService: SpaceService,
    private notifications: Notifications) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  isSpaceSelected(space: Space) {
    return this.favoriteSpaces
      .map(s => s.attributes.assignedId)
      .indexOf(space.attributes.assignedId) > -1;
  }

  save() {
    let result: Space[] = [];
    this.ownedSpaces.forEach(e => {
      let index = this.selectedSpaces.indexOf(e.attributes.assignedId);
      if (index !== -1) {
        result.push(e);
      }
    });
    this.collaboratedSpaces.forEach(e => {
      let index = this.selectedSpaces.indexOf(e.attributes.assignedId);
      if (index !== -1) {
        result.push(e);
      }
    });
    this.onChange.emit(result);
    this.close();
  }

  close() {
    this.host.hide();
    this.selectedSpaces = [];
  }

}
