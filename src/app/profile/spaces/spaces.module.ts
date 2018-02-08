import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { ClarksnutModule } from '../../ngx/ngx-clarksnut';

import { SpacesComponent } from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpaceWizardModule } from '../../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    SpacesRoutingModule,
    SpaceWizardModule,
    ClarksnutModule
  ],
  declarations: [SpacesComponent]
})
export class SpacesModule {
  constructor(http: Http) {
  }
}
