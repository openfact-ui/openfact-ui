import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import {
  ListModule,
  EmptyStateModule,
  ActionModule
} from 'patternfly-ng';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';

import { SpaceTabsModule } from './space-tabs/space-tabs.module';
import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';
import { SidebarModule } from './../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    InboxRoutingModule,
    ListModule,
    EmptyStateModule,
    ActionModule,
    DocumentSearchToolbarModule,
    SpaceTabsModule,
    SidebarModule
  ],
  declarations: [InboxComponent],
})
export class InboxModule {
  constructor(http: Http) {
  }
}
