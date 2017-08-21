import {Inject, Injectable} from '@angular/core';
import {Restangular} from 'ngx-restangular';
import {WatcherFactory} from './watcher-factory.service';
import {OPENFACT_RESTANGULAR} from './openfact.restangular';
import {OpenfactService} from './openfact.service';
import {Space, Spaces} from '../model/space.model';

const spacesUrl = '/api/v1/spaces';

function spaceApiUrl() {
  return spacesUrl;
}

@Injectable()
export class NamespaceService extends OpenfactService<Space, Spaces> {

  constructor(@Inject(OPENFACT_RESTANGULAR) openfactRestangular: Restangular, watcherFactory: WatcherFactory) {
    super(openfactRestangular.service(spaceApiUrl()), watcherFactory);
  }

  get serviceUrl(): string {
    return spaceApiUrl();
  }
}
