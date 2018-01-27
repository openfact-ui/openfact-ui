import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WizardModule } from 'patternfly-ng/wizard';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverConfig, PopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';

import { FormExtensionsModule } from './../../util/form-extensions/form-extensions.module';

import { SpaceWizardComponent } from './space-wizard.component';
import { SpaceTermsConditionsComponent } from './components/space-terms-conditions/space-terms-conditions.component';
import { SpaceFormComponent } from './components/space-form/space-form.component';
import { RequestAccessFormComponent } from './components/request-access-form/request-access-form.component';

import { LoggerFactory } from './common/logger';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WizardModule,
    TooltipModule,
    PopoverModule,
    ModalModule,
    TranslateModule,
    FormExtensionsModule
  ],
  declarations: [
    SpaceWizardComponent,
    SpaceTermsConditionsComponent,
    SpaceFormComponent,
    RequestAccessFormComponent,
  ],
  exports: [
    SpaceWizardComponent,
  ],
  providers: [
    TooltipConfig,
    PopoverConfig,
    LoggerFactory,
  ]
})

export class SpaceWizardModule {

}
