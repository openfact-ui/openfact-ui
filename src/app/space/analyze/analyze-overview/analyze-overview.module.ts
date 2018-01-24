import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';
// import { Broadcaster } from 'ngx-login-client';

import { AnalyzeOverviewComponent } from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';
import { SpaceWizardModule } from '../../wizard/space-wizard.module';

import { EditSpaceDescriptionWidgetModule } from './../../../dashboard-widgets/edit-space-description-widget/edit-space-description-widget.module';

@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    ModalModule,
    FormsModule,
    SpaceWizardModule,

    EditSpaceDescriptionWidgetModule
  ],
  declarations: [AnalyzeOverviewComponent]
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
