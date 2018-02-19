import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteCollaboratorDialogComponent } from './delete-collaborator-dialog.component';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    ModalModule
  ],
  declarations: [DeleteCollaboratorDialogComponent],
  exports: [DeleteCollaboratorDialogComponent]
})
export class DeleteCollaboratorDialogModule { }
