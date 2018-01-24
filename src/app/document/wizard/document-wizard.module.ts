import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WizardModule } from 'patternfly-ng/wizard';
import { ModalModule } from 'ngx-bootstrap';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgUploaderModule } from 'ngx-uploader';

import { DocumentWizardComponent } from './document-wizard.component';
@NgModule({
    imports: [
        CommonModule,
        WizardModule,
        TooltipModule,
        ModalModule,
        NgUploaderModule,
    ],
    declarations: [
        DocumentWizardComponent,
    ],
    exports: [
        DocumentWizardComponent,
    ],
    providers: [
        TooltipConfig,
    ]
})

export class DocumentWizardModule {

}
