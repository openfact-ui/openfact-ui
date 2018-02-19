import { REALM } from '../../ngx/ngx-login-client';

import { ApiLocatorService } from '../../config/api-locator.service';

const realmFactory = (api: ApiLocatorService) => {
  return api.realm;
};

export let realmProvider = {
  provide: REALM,
  useFactory: realmFactory,
  deps: [ApiLocatorService]
};
