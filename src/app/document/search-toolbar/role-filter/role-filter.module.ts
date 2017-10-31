import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { RoleFilterComponent } from './role-filter.component';

@NgModule({
  imports: [
    CommonModule,
    BsDropdownModule
  ],
  declarations: [
    RoleFilterComponent,
  ],
  exports: [
    RoleFilterComponent,
  ],
  providers: [

  ]
})

export class RoleFilterModule {

}
