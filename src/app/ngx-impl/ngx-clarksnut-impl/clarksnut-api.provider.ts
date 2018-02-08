import { CLARKSNUT_API_URL } from '../../ngx/ngx-clarksnut';
import { ApiLocatorService } from '../../config/api-locator.service';

export function clarksnutApiUrlFactory(api: ApiLocatorService) {
  return api.clarksnutApiUrl;
}

export let clarksnutApiUrlProvider = {
  provide: CLARKSNUT_API_URL,
  useFactory: clarksnutApiUrlFactory,
  deps: [ApiLocatorService]
};
