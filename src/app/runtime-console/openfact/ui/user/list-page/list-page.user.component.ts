import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Users } from '../../../model/user.model';
import { UserStore } from '../../../store/user.store';

@Component({
  host: {
    'class': 'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'openfact-users-list-page',
  templateUrl: './list-page.user.component.html',
  styleUrls: ['./list-page.user.component.scss'],
})
export class UsersListPage implements OnInit {
  private readonly users: Observable<Users>;
  private readonly loading: Observable<boolean>;

  constructor(private usersStore: UserStore) {
    this.users = this.usersStore.list;
    this.loading = this.usersStore.loading;
  }

  ngOnInit() {
    this.usersStore.loadAll();
  }

}
