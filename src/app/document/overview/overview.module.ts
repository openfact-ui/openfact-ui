import { SidebarModule } from './../sidebar/sidebar.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    OpenfactSyncModule,
    DocumentSearchToolbarModule,
    SidebarModule
  ],
  declarations: [OverviewComponent],
})
export class OverviewModule {
  constructor(http: Http) {
  }
}
