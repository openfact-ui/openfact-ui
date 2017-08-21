import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ngx-restangular';
import { WatcherFactory } from './watcher-factory.service';
import { OPENFACT_RESTANGULAR } from './openfact.restangular';
import { OpenfactService } from './openfact.service';
import { User, Users } from '../model/user.model';

const usersUrl = '/api/v1/users';

function userApiUrl() {
  return usersUrl;
}

@Injectable()
export class UserService extends OpenfactService<User, Users> {

  constructor( @Inject(OPENFACT_RESTANGULAR) openfactRestangular: Restangular, watcherFactory: WatcherFactory) {
    super(openfactRestangular.service(userApiUrl()), watcherFactory);
  }

  get serviceUrl(): string {
    return userApiUrl();
  }
}
