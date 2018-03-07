import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

import { SearchDocumentComponent } from './search-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbTypeaheadModule.forRoot(),
    TranslateModule
  ],
  declarations: [SearchDocumentComponent],
  exports: [SearchDocumentComponent]
})
export class SearchDocumentModule { }
