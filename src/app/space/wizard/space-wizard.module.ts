import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WizardModule } from 'patternfly-ng';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';

import { FormExtensionsModule } from './../../util/form-extensions/form-extensions.module';

import { SpaceWizardComponent } from './space-wizard.component';
import {
  SpaceTermsConditionsComponent
} from './components/space-terms-conditions/space-terms-conditions.component';
import { SpaceFormComponent } from './components/space-form/space-form.component';

import { TrustHtmlPipe, TrustStylePipe } from './pipes/safe-html.pipe';
import { VisibleItemsPipe } from './pipes/visible-items.pipe';
import { SelectedItemsPipe } from './pipes/selected-items.pipe';

import { LoggerFactory } from './common/logger';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WizardModule,
    TooltipModule,
    ModalModule,
    TranslateModule,
    FormExtensionsModule
  ],
  declarations: [
    SpaceWizardComponent,
    SpaceTermsConditionsComponent,
    SpaceFormComponent,

    SelectedItemsPipe,
    VisibleItemsPipe,
    TrustHtmlPipe,
    TrustStylePipe,
  ],
  exports: [
    SpaceWizardComponent,
  ],
  providers: [
    TooltipConfig,
    LoggerFactory,
  ]
})

export class SpaceWizardModule {

}
