import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RemainingCharsCountModule } from 'patternfly-ng/remaining-chars-count';

import { FormExtensionsModule } from './../../../util/form-extensions/form-extensions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AreasRoutingModule,
    FormExtensionsModule,
    RemainingCharsCountModule,
  ],
  declarations: [
    AreasComponent
  ],
  providers: [

  ]
})
export class AreasModule {
  constructor(http: Http) { }
}
