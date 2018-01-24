import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CurrencyMaskModule } from "ng2-currency-mask";

import { NumberFilterComponent } from './number-filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    BsDropdownModule,
    CurrencyMaskModule
  ],
  declarations: [
    NumberFilterComponent,
  ],
  exports: [
    NumberFilterComponent,
  ],
  providers: [

  ]
})

export class NumberFilterModule {

}
