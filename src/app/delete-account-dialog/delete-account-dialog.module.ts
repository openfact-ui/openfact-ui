import { CommonModule } from '@angular/common';
import { DeleteAccountDialogComponent } from './delete-account-dialog.component';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [
    DeleteAccountDialogComponent
  ],
  exports: [
    DeleteAccountDialogComponent,
    ModalModule
  ]
})
export class DeleteAccountDialogModule { }
