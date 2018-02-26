import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UtilModule } from '../../../util/util.module';
import { DocumentPeriodPickerModule } from './../../../document/document-filters/document-period-picker/document-period-picker.module';
import { PartyFilterComponent } from './party-filter/party-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    BsDropdownModule,
    UtilModule,
    DocumentPeriodPickerModule
  ],
  declarations: [ReportsComponent, PartyFilterComponent],
  providers: []
})
export class ReportsModule { }
