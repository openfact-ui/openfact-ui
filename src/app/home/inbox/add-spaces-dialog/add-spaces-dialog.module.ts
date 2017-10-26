import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-modal';

import { AddSpacesDialogComponent } from './add-spaces-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    FormsModule
  ],
  declarations: [AddSpacesDialogComponent],
  exports: [
    AddSpacesDialogComponent,
    ModalModule
  ]
})
export class AddSpacesDialogModule { }
