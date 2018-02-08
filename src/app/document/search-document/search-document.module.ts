import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchDocumentComponent } from './search-document.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [SearchDocumentComponent],
  exports: [SearchDocumentComponent]
})
export class SearchDocumentModule { }
