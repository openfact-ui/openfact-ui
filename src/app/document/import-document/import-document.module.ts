import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { WizardModule } from 'patternfly-ng/wizard';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgUploaderModule } from 'ngx-uploader';

import { ImportDocumentComponent } from './import-document.component';
import { FormsModule } from '@angular/forms';

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
