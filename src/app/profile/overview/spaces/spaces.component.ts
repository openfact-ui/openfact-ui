import { Component, OnDestroy, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, Contexts } from '../../../ngx-clarksnut';
import { Logger } from '../../../ngx-base';
import { Space, SpaceService } from '../../../ngx-clarksnut';
import { UserService, User } from '../../../ngx-login-client';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ofs-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnDestroy, OnInit {

  context: Context;
  loggedInUser: User;
  pageSize: number = 20;
  subscriptions: Subscription[] = [];
  spaceToDelete: Space;
  spaces: Space[] = [];
  modalRef: BsModalRef;

  constructor(
    private contexts: Contexts,
    private logger: Logger,
    private spaceService: SpaceService,
    private userService: UserService,
    private modalService: BsModalService) {
    this.subscriptions.push(contexts.current.subscribe((val) => this.context = val));
  }

  public ngOnInit(): void {
    this.initSpaces({ pageSize: this.pageSize });
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Actions

  public initSpaces(event: any): void {
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe((spaces) => {
          this.spaces = spaces;
        }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  public fetchMoreSpaces($event): void {
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService.getMoreSpacesByUser()
        .subscribe((spaces) => {
          this.spaces = this.spaces.concat(spaces);
        },
        (err) => {
          this.logger.error(err);
        }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  public removeSpace(): void {
    if (this.context && this.context.user && this.spaceToDelete) {
      let space = this.spaceToDelete;
      this.subscriptions.push(this.spaceService.deleteSpace(space)
        .subscribe((spaces) => {
          let index = this.spaces.indexOf(space);
          this.spaces.splice(index, 1);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        },
        (err) => {
          this.logger.error(err);
          this.spaceToDelete = undefined;
          this.modalRef.hide();
        }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  public confirmDeleteSpace(space: Space, deleteSpace: TemplateRef<any>): void {
    this.spaceToDelete = space;
    this.modalRef = this.modalService.show(deleteSpace, { class: 'modal-lg' });
  }

  cancel() {
    this.modalRef.hide();
  }

  // Private

}
