import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import {
  ListModule,
  EmptyStateModule,
  ActionModule
} from 'patternfly-ng';

import { SearchResultsComponent } from './search-results.component';

@NgModule({
  imports: [
    CommonModule,
    ListModule,
    EmptyStateModule,
    ActionModule
  ],
  declarations: [SearchResultsComponent],
  exports: [SearchResultsComponent]
})
export class SearchResultsModule {
  constructor(http: Http) {
  }
}
