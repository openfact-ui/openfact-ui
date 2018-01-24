import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VSChecklistModule } from 'ng2-vs-checklist';

import { AddSpacesDialogComponent } from './add-spaces-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    VSChecklistModule
  ],
  declarations: [AddSpacesDialogComponent],
  exports: [
    AddSpacesDialogComponent
  ]
})
export class AddSpacesDialogModule { }
