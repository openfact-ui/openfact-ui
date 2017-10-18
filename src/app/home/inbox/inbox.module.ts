import { DocumentSearchToolbarModule } from './../../document/search-toolbar/document-search-toolbar.module';
import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { InboxRoutingModule } from './inbox-routing.module';
import { InboxComponent } from './inbox.component';

@NgModule({
  imports: [
    CommonModule,
    InboxRoutingModule,
    OpenfactSyncModule,
    DocumentSearchToolbarModule
  ],
  declarations: [InboxComponent],
})
export class InboxModule {
  constructor(http: Http) {
  }
}
