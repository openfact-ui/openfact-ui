import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
  ViewChildren,
  ElementRef,
  ContentChild
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { IMultiSelectOption, IMultiSelectSettings } from 'angular-2-dropdown-multiselect';

import { Context, CollaboratorService, Space } from '../../../../ngx/ngx-clarksnut';
import { User, UserService } from '../../../../ngx/ngx-login-client';

import { ContextService } from '../../../../ngx-impl/ngx-clarksnut-impl/context.service';
import { Notifications, Notification, NotificationType } from '../../../../ngx/ngx-base';

@Component({
  selector: 'cn-add-collaborators-dialog',
  templateUrl: './add-collaborators-dialog.component.html',
  styleUrls: ['./add-collaborators-dialog.component.scss']
})
export class AddCollaboratorsDialogComponent implements OnInit, OnDestroy {

  modalRef: BsModalRef;
  @ViewChild('modalTemplate') modal: TemplateRef<any>;

  @Input() space: Space;
  @Input() collaborators: User[];
  @Output() added = new EventEmitter<User[]>();

  dropdownOptions: IMultiSelectOption[] = [];
  dropdownModel: User[];
  dropdownSettings: IMultiSelectSettings;

  private context: Context;
  private subscriptions: Subscription[] = [];

  constructor(
    private modalService: BsModalService,
    private contexts: ContextService,
    private userService: UserService,
    private collaboratorService: CollaboratorService,
    private notifications: Notifications) {
    this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.dropdownSettings = {
      pullRight: false,
      enableSearch: true,
      checkedStyle: 'checkboxes',
      buttonClasses: 'btn btn-default',
      selectionLimit: 0,
      closeOnSelect: false,
      showCheckAll: false,
      showUncheckAll: false,
      dynamicTitleMaxItems: 3,
      maxHeight: '300px',
      isLazyLoad: true
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  open() {
    this.subscriptions.push(this.modalService.onShow.subscribe((reason: string) => {
      this.dropdownModel = [];
    }));
    this.modalRef = this.modalService.show(this.modal);
  }

  close() {
    this.modalRef.hide();
  }

  addCollaborators() {
    this.collaboratorService.addCollaborators('me', this.space.id, this.dropdownModel).subscribe(
      () => {
        this.added.emit(this.dropdownModel as User[]);
        this.close();
      },
      (error) => {
        this.notifications.message({
          message: 'Could not add Collaborators',
          type: NotificationType.DANGER
        } as Notification);
      });
  }

  changed(enteredValue: any) {
    const searchValue = enteredValue.filter;
    this.userService.getUsersBySearchString(searchValue).subscribe((users) => {
      this.dropdownOptions = [];
      users.forEach(user => {
        this.dropdownOptions.push({
          id: user,
          name: user.attributes.fullName + ' (' + user.attributes.username + ')'
        });
      });
    });
  }

}
