import { Injectable } from '@angular/core';
import { OpenfactResource } from '../model/openfactresource.model';
import { SpaceResourceService } from '../service/space.resource.service';
import { SpaceScope } from '../service/space.scope';
import { Subscription } from 'rxjs';
import { OpenfactResourceStore } from './openfactresource.store';

@Injectable()
export abstract class SpaceResourceStore<T extends OpenfactResource, L extends Array<T>, R extends SpaceResourceService<T, L>> extends OpenfactResourceStore<T, L, R> {
  private spaceSubscription: Subscription;

  constructor(service: any, initialList: any, initialCurrent: any, public spaceScope: SpaceScope, type: any) {
    super(service, initialList, initialCurrent, type);
    if (this.spaceScope) {
      this.spaceSubscription = this.spaceScope.space.subscribe(
        (space) => {
          this.service.space = space;
          this.recreateWatcher();
          this.reload();
        },
      );
    }
  }

  get space(): string {
    return this.service.space;
  }
}
