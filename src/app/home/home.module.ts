import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

import {
  RecentDocumentsWidgetModule
} from '../dashboard-widgets/recent-documents-widget/recent-documents-widget.module';

import {
  RepositoriesWidgetModule
} from './../dashboard-widgets/repositories-widget/repositories-widget.module';

import {
  SpacesWidgetModule
} from './../dashboard-widgets/spaces-widget/spaces-widget.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ModalModule,
    OpenfactSyncModule,
    RecentDocumentsWidgetModule,
    RepositoriesWidgetModule,
    SpacesWidgetModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {
  constructor(http: Http) { }
}
