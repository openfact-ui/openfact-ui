import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SortModule } from 'patternfly-ng';
import { ModalModule } from 'ngx-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MyDateRangePickerModule } from 'mydaterangepicker';

import { DocumentSearchToolbarComponent } from './document-search-toolbar.component';
import { DateFilterComponent } from './date-filter/date-filter.component';
import { NumberFilterComponent } from './number-filter/number-filter.component';
import { RoleFilterComponent } from './role-filter/role-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SortModule,
    ModalModule,
    BsDropdownModule,
    MyDateRangePickerModule
  ],
  declarations: [
    DocumentSearchToolbarComponent,
    NumberFilterComponent,
    DateFilterComponent,
    RoleFilterComponent
  ],
  exports: [
    DocumentSearchToolbarComponent,
  ],
  providers: [

  ]
})

export class DocumentSearchToolbarModule {

}
