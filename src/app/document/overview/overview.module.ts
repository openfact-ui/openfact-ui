import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { MomentModule } from 'angular2-moment';
import { ClarksnutModule } from '../../ngx/ngx-clarksnut';

import { SidebarModule } from './../sidebar/sidebar.module';
import { DocumentSearchToolbarModule } from './../search-toolbar/document-search-toolbar.module';

import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    OverviewRoutingModule,
    ClarksnutModule,
    DocumentSearchToolbarModule,
    SidebarModule
  ],
  declarations: [OverviewComponent],
})
export class OverviewModule {
  constructor(http: Http) {
  }
}
