import { Component, OnInit, TemplateRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Space, CollaboratorService } from '../../../../ngx/ngx-clarksnut';
import { User } from '../../../../ngx/ngx-login-client';
import { Notifications, Notification, NotificationType } from '../../../../ngx/ngx-base';

@Component({
  selector: 'cn-delete-collaborator-dialog',
  templateUrl: './delete-collaborator-dialog.component.html',
  styleUrls: ['./delete-collaborator-dialog.component.scss']
})
export class DeleteCollaboratorDialogComponent implements OnInit {


  @Output() deleted = new EventEmitter<boolean>();

  @ViewChild('modalTemplate') wizardTemplate: TemplateRef<any>;

  private space: Space;
  private user: User;
  private modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private collaboratorService: CollaboratorService,
    private notifications: Notifications) {
  }

  ngOnInit() {
  }

  // Modal actions
  open(space: Space, user: User) {
    this.space = space;
    this.user = user;
    this.modalRef = this.modalService.show(this.wizardTemplate);
  }

  cancel() {
    this.close();
  }

  close() {
    this.modalRef.hide();
    this.space = null;
    this.user = null;
  }

  delete() {
    this.collaboratorService.removeCollaborator('me', this.space.id, this.user.id).subscribe(
      (spaces) => {
        this.notifications.message({
          message: 'Collaborator removed',
          type: NotificationType.SUCCESS
        } as Notification);
        this.close();

        this.deleted.emit(true);
      },
      (err) => {
        this.notifications.message({
          message: 'Could not remove Collaborator',
          type: NotificationType.DANGER
        } as Notification);
      });
  }

}
