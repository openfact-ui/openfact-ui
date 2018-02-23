import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UtilModule } from '../../../util/util.module';
import { DocumentPeriodPickerModule } from './../../../document/document-filters/document-period-picker/document-period-picker.module';

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule,
    BsDropdownModule,
    UtilModule,
    DocumentPeriodPickerModule
  ],
  declarations: [ReportsComponent]
})
export class ReportsModule { }
