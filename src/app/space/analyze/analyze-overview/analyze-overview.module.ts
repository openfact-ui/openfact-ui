import { PatternFlyNgModule } from 'patternfly-ng';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { ModalModule } from 'ngx-modal';
import { FormsModule } from '@angular/forms';

import { AnalyzeOverviewComponent } from './analyze-overview.component';
import { AnalyzeOverviewRoutingModule } from './analyze-overview-routing.module';
import { SpaceWizardModule } from '../../wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    AnalyzeOverviewRoutingModule,
    ModalModule,
    FormsModule,
    SpaceWizardModule,
    PatternFlyNgModule,
  ],
  declarations: [AnalyzeOverviewComponent]
})
export class AnalyzeOverviewModule {
  constructor(http: Http) { }
}
