import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClarksnutModule } from '../../../ngx/ngx-clarksnut';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgArrayPipesModule } from 'angular-pipes';

import { SpaceWizardModule } from '../../../space/wizard/space-wizard.module';
import { SpacesComponent } from './spaces.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    ClarksnutModule,
    FormsModule,
    ModalModule.forRoot(),
    NgArrayPipesModule,
    SpaceWizardModule
  ],
  declarations: [SpacesComponent],
  exports: [SpacesComponent],
})
export class SpacesModule { }
