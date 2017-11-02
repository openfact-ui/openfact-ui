import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import {
  ListModule,
  EmptyStateModule,
  ActionModule
} from 'patternfly-ng';

import { StarredRoutingModule } from './starred-routing.module';
import { StarredComponent } from './starred.component';

import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';
import { SidebarModule } from './../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    StarredRoutingModule,
    ListModule,
    EmptyStateModule,
    ActionModule,
    DocumentSearchToolbarModule,
    SidebarModule
  ],
  declarations: [StarredComponent],
})
export class StarredModule {
  constructor(http: Http) {
  }
}
