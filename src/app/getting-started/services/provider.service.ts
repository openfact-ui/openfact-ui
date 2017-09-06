import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'ngo-login-client';
import { Logger } from 'ngo-base';
import { SYNC_API_URL } from 'ngo-openfact-sync';

import * as jwt_decode from 'jwt-decode';

@Injectable()
export class ProviderService {
  private loginUrl: string;

  constructor(
    private auth: AuthenticationService,
    private logger: Logger,
    @Inject(SYNC_API_URL) apiUrl: string) {
    this.loginUrl = apiUrl + 'login';
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  public linkAll(redirect: string): void {
    this.link(null, redirect);
  }

  /**
   * Link a GitHub account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  public linkGitHub(redirect: string): void {
    this.link('github', redirect);
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  public linkOpenShift(redirect: string): void {
    this.link('openshift-v3', redirect);
  }

  /**
   * Link an Identity Provider account to the user account
   *
   * @param provider Identity Provider name to link to the user's account
   * @param redirect URL to be redirected to after successful account linking
   */
  public link(provider: string, redirect: string): void {
    let parsedToken = jwt_decode(this.auth.getAccessToken());
    let url = `${this.loginUrl}/linksession?`
      + 'clientSession=' + parsedToken.client_session
      + '&sessionState=' + parsedToken.session_state
      + '&redirect=' + redirect;
    if (provider != null) {
      url += '&provider=' + provider;
    }
    this.redirectToAuth(url);
  }

  // Private

  private redirectToAuth(url) {
    window.location.href = url;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
