import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { UserStore } from '../../../store/user.store';

@Component({
  selector: 'openfact-user-view-page',
  templateUrl: './view-page.user.component.html',
})
export class UserViewPage implements OnDestroy {

  private idSubscription: Subscription;

  constructor(store: UserStore, route: ActivatedRoute) {
    this.idSubscription = route.params.pluck<Params, string>('id')
      .map((id) => store.load(id))
      .subscribe();
  }

  ngOnDestroy() { this.idSubscription.unsubscribe(); }
}
