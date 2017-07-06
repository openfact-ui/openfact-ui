import { ApiLocatorService } from './api-locator.service';
import { SYNC_API_URL } from '../ngx-openfact-sync';

export function syncApiUrlFactory(api: ApiLocatorService) {
  return api.witApiUrl;
}

export let syncApiUrlProvider = {
  provide: SYNC_API_URL,
  useFactory: syncApiUrlFactory,
  deps: [ApiLocatorService]
};
