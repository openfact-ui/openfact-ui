import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilterDocumentComponent } from './filter-document.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule
  ],
  declarations: [FilterDocumentComponent],
  exports: [FilterDocumentComponent]
})
export class FilterDocumentModule { }
