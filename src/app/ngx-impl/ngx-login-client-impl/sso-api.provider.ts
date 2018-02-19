import { SSO_API_URL } from '../../ngx/ngx-login-client';

import { ApiLocatorService } from '../../config/api-locator.service';

const ssoApiUrlFactory = (api: ApiLocatorService) => {
  return api.ssoApiUrl;
};

export let ssoApiUrlProvider = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory,
  deps: [ApiLocatorService]
};
