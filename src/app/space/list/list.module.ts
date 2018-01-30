import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list.component';
import { ListRoutingModule } from './list-routing.module';
import { OverviewComponent } from './overview/overview.component';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { ClarksnutModule } from './../../ngx-clarksnut';
import { SpaceWizardModule } from './../wizard/space-wizard.module';
import { SharedPipesModule } from './../../shared-pipes/shared-pipes.module';
import { SharedDirectivesModule } from './../../shared-directives/shared-directives.module';
import { SpaceDeleteModule } from '../delete/space-delete.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ListRoutingModule,
    BsDropdownModule,
    MomentModule,
    TranslateModule,
    ClarksnutModule,
    SharedPipesModule,
    SpaceWizardModule,
    SpaceDeleteModule,
    SharedDirectivesModule,
  ],
  declarations: [
    ListComponent,
    OverviewComponent
  ]
})
export class ListModule { }
