import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { ModalModule } from 'ngx-modal';
import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ModalModule,
    OpenfactSyncModule,
  ],
  declarations: [HomeComponent]
})
export class HomeModule {
  constructor(http: Http) {}
}
