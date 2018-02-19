import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaboratorsRoutingModule } from './collaborators-routing.module';
import { CollaboratorsComponent } from './collaborators.component';
import { AddCollaboratorsDialogModule } from './add-collaborators-dialog/add-collaborators-dialog.module';
import { DeleteCollaboratorDialogModule } from './delete-collaborator-dialog/delete-collaborator-dialog.module';

@NgModule({
  imports: [
    CommonModule,
    CollaboratorsRoutingModule,
    AddCollaboratorsDialogModule,
    DeleteCollaboratorDialogModule
  ],
  declarations: [CollaboratorsComponent]
})
export class CollaboratorsModule { }
