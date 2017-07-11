import { SYNC_API_URL } from 'ngo-openfact-sync';
import { ApiLocatorService } from './api-locator.service';

let syncApiUrlFactory = (api: ApiLocatorService) => {
  return api.syncApiUrl;
};

export let syncApiUrlProvider = {
  provide: SYNC_API_URL,
  useFactory: syncApiUrlFactory,
  deps: [ApiLocatorService]
};
