import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';

import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';
import { SearchResultsModule } from './../search-results/search-results.module';
import { SidebarModule } from './../sidebar/sidebar.module';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    DocumentSearchToolbarModule,
    SearchResultsModule,
    SidebarModule
  ],
  declarations: [SearchComponent],
})
export class SearchModule {
  constructor(http: Http) {
  }
}
