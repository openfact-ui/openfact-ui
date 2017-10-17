import {ApiLocatorService} from './api-locator.service';
import {AUTH_API_URL} from 'ngo-login-client';

export function authApiUrlFactory(api: ApiLocatorService) {
  return api.syncApiUrl;
}

export let authApiUrlProvider = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory,
  deps: [ApiLocatorService]
};
