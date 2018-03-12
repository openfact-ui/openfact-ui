import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import { User } from '../../../ngx/ngx-login-client';
import { Context, CollaboratorService } from './../../../ngx/ngx-clarksnut';
import { ContextService } from './../../../ngx-impl/ngx-clarksnut-impl/context.service';

@Component({
  selector: 'cn-collaborators',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.scss']
})
export class CollaboratorsComponent implements OnInit, OnDestroy {

  context: Context;
  collaborators: User[] = [];

  emptyStateConfig: EmptyStateConfig;

  private subscriptions: Subscription[] = [];

  constructor(
    private contexts: ContextService,
    private collaboratorService: CollaboratorService) {
    this.subscriptions.push(
      this.contexts.current.subscribe((val) => {
        this.context = val;
      })
    );
  }

  ngOnInit() {
    this.refreshCollaborators();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  refreshCollaborators() {
    this.collaboratorService.getInitialBySpaceId('me', this.context.space.id, 20).subscribe(collaborators => {
      this.collaborators = collaborators;
    });
  }
}
