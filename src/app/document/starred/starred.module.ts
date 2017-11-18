import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { StarredRoutingModule } from './starred-routing.module';
import { StarredComponent } from './starred.component';

import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';
import { SearchResultsModule } from './../search-results/search-results.module';
import { SidebarModule } from './../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    StarredRoutingModule,
    DocumentSearchToolbarModule,
    SearchResultsModule,
    SidebarModule
  ],
  declarations: [StarredComponent],
})
export class StarredModule {
  constructor(http: Http) {
  }
}
