import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WizardModule } from 'patternfly-ng';
import { ModalModule } from 'ngx-bootstrap';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { FormExtensionsModule } from './../../util/form-extensions/form-extensions.module';

import { SpaceWizardComponent } from './space-wizard.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        WizardModule,
        TooltipModule,
        ModalModule,
        FormExtensionsModule
    ],
    declarations: [
        SpaceWizardComponent,
    ],
    exports: [
        SpaceWizardComponent,
    ],
    providers: [
        TooltipConfig,
    ]
})

export class SpaceWizardModule {

}
