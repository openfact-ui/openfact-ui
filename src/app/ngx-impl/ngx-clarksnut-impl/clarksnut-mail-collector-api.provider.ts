import { CLARKSNUT_MAIL_COLLECTOR_API_URL } from '../../ngx/ngx-clarksnut';
import { ApiLocatorService } from '../../config/api-locator.service';

export function clarksnutMailCollectorApiUrlFactory(api: ApiLocatorService) {
  return api.clarksnutMailCollectorApiUrl;
}

export let clarksnutMailCollectorApiUrlProvider = {
  provide: CLARKSNUT_MAIL_COLLECTOR_API_URL,
  useFactory: clarksnutMailCollectorApiUrlFactory,
  deps: [ApiLocatorService]
};
