import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { ActionModule } from 'patternfly-ng/action';
import { ListModule } from 'patternfly-ng/list';
import { EmptyStateModule } from 'patternfly-ng/empty-state';

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
