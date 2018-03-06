import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { RemainingCharsCountModule } from 'patternfly-ng/remaining-chars-count';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

import { FormExtensionsModule } from '../../form-extensions/form-extensions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RemainingCharsCountModule,
    UpdateRoutingModule,
    FormExtensionsModule
  ],
  declarations: [UpdateComponent],
})
export class UpdateModule { }
