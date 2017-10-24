import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { ListModule, EmptyStateModule, ActionModule } from 'patternfly-ng';
import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { DocumentSearchToolbarModule } from './../../document/search-toolbar/document-search-toolbar.module';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';

@NgModule({
  imports: [
    CommonModule,
    InboxRoutingModule,
    ListModule,
    EmptyStateModule,
    ActionModule,
    OpenfactSyncModule,
    DocumentSearchToolbarModule
  ],
  declarations: [InboxComponent],
})
export class InboxModule {
  constructor(http: Http) {
  }
}
