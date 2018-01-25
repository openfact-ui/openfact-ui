import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LandsideComponent } from './landside/landside.component';

import { SpaceWizardModule } from '../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SpaceWizardModule
  ],
  declarations: [
    HomeComponent,
    LandsideComponent
  ],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
