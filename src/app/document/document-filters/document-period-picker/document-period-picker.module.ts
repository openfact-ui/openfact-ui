import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentPeriodPickerComponent } from './document-period-picker.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule
  ],
  declarations: [DocumentPeriodPickerComponent],
  exports: [DocumentPeriodPickerComponent]
})
export class DocumentPeriodPickerModule { }
