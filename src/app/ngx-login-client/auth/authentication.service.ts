import { AuthService } from './../auth-service';
import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import { Broadcaster } from '../../ngx-base';

import { AUTH_API_URL } from '../shared/auth-api';
import { SSO_API_URL } from '../shared/sso-api';
import { REALM } from '../shared/realm-token';
import { Token } from '../user/token';

export interface ProcessTokenResponse {
  (response: Response): Token;
}

@Injectable()
export class AuthenticationService {

  // Tokens
  readonly google = 'google';

  private refreshInterval: number;
  private apiUrl: string;
  private ssoUrl: string;
  private realm: string;
  private clearTimeoutId: any;
  private refreshTokens: Subject<Token> = new Subject();

  constructor(
    private broadcaster: Broadcaster,
    @Inject(AUTH_API_URL) apiUrl: string,
    @Inject(SSO_API_URL) ssoUrl: string,
    @Inject(REALM) realm: string,
    private http: Http,
    private authService: AuthService) {
    this.apiUrl = apiUrl;
    this.ssoUrl = ssoUrl;
    this.realm = realm;
  }

  onLogIn() {
    this.broadcaster.broadcast('loggedin', 1);
  }

  logout() {
    this.broadcaster.broadcast('logout', 1);
    this.logout();
  }

  /**
   * Return Google token
   */
  getGoogleToken(): Observable<string> {
    return this.createFederatedToken(this.google, (response: Response) => response.json() as Token);
  }

  private createFederatedToken(broker: string, processToken: ProcessTokenResponse): Observable<string> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let tokenUrl = `${this.ssoUrl}/realms/${this.realm}/broker/${broker}/token`;
    headers.set('Authorization', `Bearer ${this.authService.getToken()}`);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(tokenUrl, options)
      .map(response => processToken(response))
      .catch(response => {
        if (response.status === 400) {
          this.broadcaster.broadcast('noFederatedToken', response);
        }
        return Observable.of({} as Token);
      })
      .map(t => t.access_token);
  }

}
