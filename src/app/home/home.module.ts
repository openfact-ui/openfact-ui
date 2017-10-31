import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

import { DocumentWizardModule } from '../document/wizard/document-wizard.module';
import { InboxModule } from './../document/inbox/inbox.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    DocumentWizardModule,
    InboxModule
  ],
  declarations: [HomeComponent],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
