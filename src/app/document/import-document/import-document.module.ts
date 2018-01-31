import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WizardModule } from 'patternfly-ng/wizard';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { NgUploaderModule } from 'ngx-uploader';

import { ImportDocumentComponent } from './import-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    WizardModule,
    ModalModule,
    TranslateModule,
    NgUploaderModule
  ],
  declarations: [ImportDocumentComponent],
  exports: [ImportDocumentComponent],
  providers: []
})
export class ImportDocumentModule { }
