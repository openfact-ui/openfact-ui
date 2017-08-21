import { Injectable } from '@angular/core';
import { OpenfactResource } from '../model/openfactresource.model';
import { UserResourceService } from '../service/user.resource.service';
import { UserScope } from '../service/user.scope';
import { Subscription } from 'rxjs';
import { OpenfactResourceStore } from './openfactresource.store';

@Injectable()
export abstract class UserResourceStore<T extends OpenfactResource, L extends Array<T>, R extends UserResourceService<T, L>> extends OpenfactResourceStore<T, L, R> {
  private userSubscription: Subscription;

  constructor(service: any, initialList: any, initialCurrent: any, public userScope: UserScope, type: any) {
    super(service, initialList, initialCurrent, type);
    if (this.userScope) {
      this.userSubscription = this.userScope.user.subscribe(
        (user) => {
          this.service.user = user;
          this.recreateWatcher();
          this.reload();
        },
      );
    }
  }

  get user(): string {
    return this.service.user;
  }
}
