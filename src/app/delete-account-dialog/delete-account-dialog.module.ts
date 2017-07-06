import { CommonModule } from '@angular/common';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    DeleteAccountDialogComponent
  ],
  exports: [
    DeleteAccountDialogComponent
  ]
})
export class DeleteAccountDialogModule { }
