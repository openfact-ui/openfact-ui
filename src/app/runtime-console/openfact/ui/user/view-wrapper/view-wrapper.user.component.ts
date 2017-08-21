import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../model/user.model';
import { UserStore } from '../../../store/user.store';
import { AbstractViewWrapperComponent } from '../../../support/abstract-viewwrapper-component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'openfact-user-view-wrapper',
  templateUrl: './view-wrapper.user.component.html',
})
export class UserViewWrapperComponent extends AbstractViewWrapperComponent implements OnInit {

  user: Observable<User>;

  constructor(private store: UserStore, route: ActivatedRoute) {
    super(route);
  }

  ngOnInit() {
    super.ngOnInit();
    this.user = this.store.resource;
  }
}
