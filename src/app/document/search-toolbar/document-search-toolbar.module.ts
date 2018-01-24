import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SortModule } from 'patternfly-ng/sort';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { RoleFilterModule } from './role-filter/role-filter.module';
import { NumberFilterModule } from './number-filter/number-filter.module';
import { DateFilterModule } from './date-filter/date-filter.module';

import { DocumentSearchToolbarComponent } from './document-search-toolbar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SortModule,
    BsDropdownModule,

    DateFilterModule,
    NumberFilterModule,
    RoleFilterModule
  ],
  declarations: [
    DocumentSearchToolbarComponent,
  ],
  exports: [
    DocumentSearchToolbarComponent,
  ],
  providers: [

  ]
})

export class DocumentSearchToolbarModule {

}
