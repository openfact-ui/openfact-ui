import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { IModalHost } from '../../wizard/models/modal-host';

import { Context, CollaboratorService } from 'ngo-openfact-sync';

import { User } from 'ngo-login-client';
import { ListConfig, EmptyStateConfig } from 'patternfly-ng';

import { ContextService } from '../../../shared/context.service';
import { find } from 'lodash';

@Component({
  selector: 'ofs-collaborators',
  templateUrl: 'collaborators.component.html',
  styleUrls: ['./collaborators.component.scss']
})
export class CollaboratorsComponent implements OnInit, OnDestroy {

  @ViewChild('addCollaborators') public addCollaboratorsModal: IModalHost;
  @ViewChild('removeCollaborator') public removeCollaborator: IModalHost;

  private context: Context;
  private collaborators: User[];
  private emptyStateConfig: EmptyStateConfig;
  private listConfig: ListConfig;
  private contextSubscription: Subscription;
  private collaboratorSubscription: Subscription;
  private userToRemove: User;

  constructor(
    private contexts: ContextService,
    private collaboratorService: CollaboratorService) {
    this.contextSubscription = this.contexts.current.subscribe((val) => {
      this.context = val;
    });
  }

  public ngOnInit() {
    this.listConfig = {
      dblClick: false,
      dragEnabled: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
    this.collaborators = [];
  }

  public ngOnDestroy() {
    this.contextSubscription.unsubscribe();
    this.collaboratorSubscription.unsubscribe();
  }

  public initCollaborators(event: any): void {
    let pageSize = event.pageSize;
    console.log('event size from page', pageSize);
    pageSize = 20;

    // tslint:disable-next-line:max-line-length
    this.collaboratorSubscription = this.collaboratorService.getInitialBySpaceId(this.context.space.id, pageSize).subscribe((collaborators) => {
      this.collaborators = collaborators;
    });
  }

  public fetchMoreCollaborators($event): void {
    this.collaboratorService.getNextCollaborators()
      .subscribe((collaborators) => {
        if (collaborators) {
          this.collaborators = this.collaborators.concat(collaborators);
        }
      }, (err) => {
        console.log(err);
      });
  }

  public launchAddCollaborators() {
    this.addCollaboratorsModal.open();
  }

  public confirmUserRemove(user: User): void {
    this.userToRemove = user;
    this.removeCollaborator.open();
  }

  public removeUser() {
    // tslint:disable-next-line:max-line-length
    this.collaboratorService.removeCollaborator(this.context.space.id, this.userToRemove.id).subscribe(() => {
      this.collaborators.splice(this.collaborators.indexOf(this.userToRemove), 1);
      this.userToRemove = null;
      this.removeCollaborator.close();
    });
  }

  public addCollaboratorsToParent(addedUsers: User[]) {
    addedUsers.forEach((user) => {
      let matchingUser = find(this.collaborators, (existing) => {
        return existing.id === user.id;
      });
      if (!matchingUser) {
        this.collaborators.push(user);
      }
    });
  }
}
