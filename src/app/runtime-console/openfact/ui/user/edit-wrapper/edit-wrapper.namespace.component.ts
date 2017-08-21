import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../model/user.model';
import { UserStore } from '../../../store/user.store';

@Component({
  selector: 'openfact-user-edit-wrapper',
  templateUrl: './edit-wrapper.user.component.html',
})
export class UserEditWrapperComponent implements OnInit {

  user: Observable<User>;

  constructor(private store: UserStore) {
  }

  ngOnInit() {
    this.user = this.store.resource;
    // this.user.subscribe((d) => this.yamlEditor.loadResource(d));
  }
}
