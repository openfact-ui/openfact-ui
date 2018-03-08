import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeModule } from 'patternfly-ng';
import { TranslateModule } from '@ngx-translate/core';

import { SearchDocumentComponent } from './search-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule.forRoot(),
    PipeModule,
    TranslateModule
  ],
  declarations: [SearchDocumentComponent],
  exports: [SearchDocumentComponent]
})
export class SearchDocumentModule { }
