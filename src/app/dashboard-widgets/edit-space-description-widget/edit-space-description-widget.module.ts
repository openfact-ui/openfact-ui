import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClarksnutModule } from '../../ngx-clarksnut';
import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClarksnutModule
  ],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
