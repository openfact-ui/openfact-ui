import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDocumentComponent } from './filter-document.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/bs-dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule
  ],
  declarations: [FilterDocumentComponent],
  exports: [FilterDocumentComponent]
})
export class FilterDocumentModule { }
