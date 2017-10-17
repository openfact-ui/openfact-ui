import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';

import { RemainingCharsCountModule } from 'patternfly-ng';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

import { FormExtensionsModule } from './../../util/form-extensions/form-extensions.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JWBootstrapSwitchModule,
    RemainingCharsCountModule,
    UpdateRoutingModule,
    FormExtensionsModule
  ],
  declarations: [UpdateComponent],
})
export class UpdateModule {
  constructor(http: Http) {
  }
}
