import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClarksnutModule } from './../../ngx/ngx-clarksnut/clarksnut.module';
import { UtilModule } from './../../util/util.module';
import { FilterDocumentComponent } from './filter-document.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule,
    TooltipModule,
    ClarksnutModule,
    UtilModule
  ],
  declarations: [FilterDocumentComponent],
  exports: [FilterDocumentComponent]
})
export class FilterDocumentModule { }
