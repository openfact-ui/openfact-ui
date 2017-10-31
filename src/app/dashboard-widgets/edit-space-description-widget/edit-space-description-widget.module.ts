import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule, AlmIconModule } from 'ngx-widgets';
import { OpenfactSyncModule } from 'ngo-openfact-sync';

import { EditSpaceDescriptionWidgetComponent } from './edit-space-description-widget.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlmIconModule,
    AlmEditableModule,
    OpenfactSyncModule
  ],
  declarations: [EditSpaceDescriptionWidgetComponent],
  exports: [EditSpaceDescriptionWidgetComponent]
})
export class EditSpaceDescriptionWidgetModule { }
