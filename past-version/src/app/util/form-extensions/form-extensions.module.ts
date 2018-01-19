import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { FormHelpBlockComponent } from './form-help-block/form-help-block.component';
import { FormControlErrorDirective } from './form-status/form-status.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
  ],
  declarations: [
    FormControlErrorDirective,
    FormHelpBlockComponent,
  ],
  exports: [
    FormControlErrorDirective,
    FormHelpBlockComponent,
  ],
  providers: [
    TooltipConfig,
  ]
})

export class FormExtensionsModule {

}
