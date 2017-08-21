import { Component } from '@angular/core';
import { User } from '../../../model/user.model';
import { UserStore } from '../../../store/user.store';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'delete-user-dialog',
  templateUrl: './delete-dialog.user.component.html',
})
export class UserDeleteDialog {

  user: User = new User();
  modal: any;

  constructor(private userService: UserService, private userStore: UserStore) {
  }

  ok() {
    console.log('deleting user ' + this.user.name);
    this.modal.close();
    this.userService.delete(this.user).subscribe(
      () => {
        this.userStore.loadAll();
      },
    );
  }

  close() {
    this.modal.close();
  }
}
