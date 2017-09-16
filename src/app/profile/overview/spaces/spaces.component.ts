import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Context, Contexts } from 'ngo-openfact-sync';
import { Logger } from 'ngo-base';
import { Space, SpaceService } from 'ngo-openfact-sync';
import { UserService, User } from 'ngo-login-client';

import { IModalHost } from '../../../space/wizard/models/modal-host';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnDestroy, OnInit {

  public context: Context;
  public loggedInUser: User;
  public pageSize: number = 20;
  public subscriptions: Subscription[] = [];
  public spaceToDelete: Space;
  public spaces: Space[] = [];
  @ViewChild('deleteSpace') public deleteSpace: IModalHost;

  constructor(private contexts: Contexts,
    private logger: Logger,
    private spaceService: SpaceService,
    private userService: UserService) {
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
          this.deleteSpace.close();
        },
        (err) => {
          this.logger.error(err);
          this.spaceToDelete = undefined;
          this.deleteSpace.close();
        }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  public confirmDeleteSpace(space: Space): void {
    this.spaceToDelete = space;
    this.deleteSpace.open();
  }

  // Private

}
