import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import {
  ListModule,
  EmptyStateModule,
  ActionModule
} from 'patternfly-ng';
import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    ListModule,
    EmptyStateModule,
    ActionModule,
    OpenfactSyncModule,
    DocumentSearchToolbarModule
  ],
  declarations: [SearchComponent],
})
export class SearchModule {
  constructor(http: Http) {
  }
}
