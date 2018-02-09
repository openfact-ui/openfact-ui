import { Injectable } from '@angular/core';
import { ClarksnutUIConfig } from '../config/clarksnut-ui-config';

const DEFAULT_API_ENV_VAR_NAMES = new Map<string, string>(
  [
    ['clarksnut', 'CLARKSNUT_API_URL'],
    ['sso', 'CLARKSNUT_SSO_API_URL'],
    ['realm', 'CLARKSNUT_REALM'],
    ['auth', 'CLARKSNUT_AUTH_API_URL']
  ]
);

const DEFAULT_API_PREFIXES = new Map<string, string>([
  ['clarksnut', 'api'],
  ['sso', 'sso'],
  ['auth', 'auth']
]);

const DEFAULT_API_PATHS = new Map<string, string>([
  ['clarksnut', 'api/'],
  ['auth', 'api/']
]);

export class BaseApiLocatorService {

  private envVars = new Map<string, string>();

  constructor(private config: ClarksnutUIConfig, private apiPrefixes: Map<String, String>, private apiPaths: Map<String, String>) {
  }

  get realm(): string {
    return this.envVars.get('realm') || 'clarksnut';
  }

  get clarksnutApiUrl(): string {
    return this.config.clarksnutApiUrl || this.buildApiUrl('clarksnut');
  }

  get clarksnutMailCollectorApiUrl(): string {
    return this.config.clarksnutMailCollectorApiUrl || this.buildApiUrl('clarksnut-mail-collector');
  }

  get ssoApiUrl(): string {
    return this.config.ssoApiUrl || this.buildApiUrl('sso');
  }

  get authApiUrl(): string {
    return this.config.authApiUrl || this.buildApiUrl('auth');
  }

  protected loadEnvVar(key: string): void {
    // this.envVars.set(key, process.env[DEFAULT_API_ENV_VAR_NAMES.get(key)]);
  }

  protected buildApiUrl(key: string): string {
    // Return any environment specified URLs for this API
    if (this.envVars.get(key)) {
      return this.envVars.get(key);
    }
    // Simple check to trim www
    let domainname = window.location.hostname;
    if (domainname.startsWith('www')) {
      domainname = window.location.hostname.slice(4);
    }
    let url = domainname;
    if (window.location.port) {
      url += ':' + window.location.port;
    }
    url += '/';
    if (this.apiPrefixes.has(key)) {
      url = this.apiPrefixes.get(key) + '.' + url;
    }
    if (this.apiPaths.has(key)) {
      url += this.apiPaths.get(key);
    }
    url = window.location.protocol + '//' + url;
    return url;
  }

}

@Injectable()
export class ApiLocatorService extends BaseApiLocatorService {

  constructor(config: ClarksnutUIConfig) {
    super(config, DEFAULT_API_PREFIXES, DEFAULT_API_PATHS);
    DEFAULT_API_ENV_VAR_NAMES.forEach((value, key) => {
      this.loadEnvVar(key);
    });
  }

}
