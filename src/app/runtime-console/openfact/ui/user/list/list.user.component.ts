import { Component, Input, ViewChild } from '@angular/core';
import { Users } from '../../../model/user.model';
import { UserDeleteDialog } from '../delete-dialog/delete-dialog.user.component';
import { ParentLinkFactory } from '../../../../common/parent-link-factory';

@Component({
  selector: 'openfact-users-list',
  templateUrl: './list.user.component.html',
})
export class UsersListComponent {

  public parentLink: string;

  @Input()
  public users: Users;

  @Input()
  public loading: boolean;

  @Input()
  public hideCheckbox: boolean;

  @ViewChild(UserDeleteDialog) deleteDialog: UserDeleteDialog;

  constructor(parentLinkFactory: ParentLinkFactory) {
    this.parentLink = parentLinkFactory.parentLink;

  }

  public openDeleteDialog(deleteUserModal, user) {
    this.deleteDialog.modal = deleteUserModal;
    this.deleteDialog.user = user;
    deleteUserModal.open();
  }

}
