import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http } from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LandsideComponent } from './landside/landside.component';

import { SpaceWizardModule } from '../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    BsDropdownModule,
    TranslateModule,
    MomentModule,
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
