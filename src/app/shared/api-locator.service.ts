import { Injectable } from '@angular/core';

import { Fabric8UIConfig } from './config/fabric8-ui-config';

@Injectable()
export class ApiLocatorService {

  public readonly DEFAULT_API_ENV_VAR_NAMES = new Map<string, string>(
    [
      ['sync', 'OPENFACT_SYNC_API_URL'],
      ['recommender', 'FABRIC8_RECOMMENDER_API_URL'],
      ['sso', 'OPENFACT_SSO_API_URL'],
      ['realm', 'OPENFACT_REALM'],
      ['branding', 'BRANDING'],
      ['forge', 'FABRIC8_FORGE_API_URL']

    ]
  );

  public readonly DEFAULT_API_PREFIXES = new Map<string, string>([
    ['sync', 'api'],
    ['recommender', 'recommender'],
    ['sso', 'sso'],
    ['forge', 'forge.api']
  ]);

  public readonly DEFAULT_API_PATHS = new Map<string, string>([
    ['sync', 'api/']
  ]);

  private envVars = new Map<string, string>();

  constructor(private config: Fabric8UIConfig) {
    this.DEFAULT_API_ENV_VAR_NAMES.forEach((value, key) => {
      this.loadEnvVar(key);
    });
  }

  get realm(): string {
    return this.envVars.get('realm') || 'openfact';
  }

  get branding(): string {
    return this.envVars.get('branding') || 'fabric8';
  }

  get syncApiUrl(): string {
    return this.config.syncApiUrl || this.buildApiUrl('sync');
  }

  get forgeApiUrl(): string {
    return this.config.forgeApiUrl || this.buildApiUrl('forge');
  }

  get ssoApiUrl(): string {
    return this.config.ssoApiUrl || this.buildApiUrl('sso');
  }

  get recommenderApiUrl(): string {
    return this.config.recommenderApiUrl || this.buildApiUrl('recommender');
  }

  private loadEnvVar(key: string): void {
    this.envVars.set(key, process.env[this.DEFAULT_API_ENV_VAR_NAMES.get(key)]);
  }

  private buildApiUrl(key: string): string {
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
    if (this.DEFAULT_API_PREFIXES.has(key)) {
      url = this.DEFAULT_API_PREFIXES.get(key) + '.' + url + '/';
    }
    if (this.DEFAULT_API_PATHS.has(key)) {
      url += this.DEFAULT_API_PATHS.get(key);
    }
    url = window.location.protocol + '//' + url;
    return url;
  }

}
