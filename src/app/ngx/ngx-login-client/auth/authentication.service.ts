import { AuthService } from '../token/auth-service';
import { Injectable, Inject } from '@angular/core';

// import { Http, Response, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Broadcaster } from '../../ngx-base';

import { AUTH_API_URL } from '../shared/auth-api';
import { SSO_API_URL } from '../shared/sso-api';
import { REALM } from '../shared/realm-token';
import { Token } from '../user/token';

export type ProcessTokenResponse = (response: any) => Token;

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
    private http: HttpClient,
    private authService: AuthService) {
    this.apiUrl = apiUrl;
    this.ssoUrl = ssoUrl;
    this.realm = realm;
  }

  logout() {
    this.broadcaster.broadcast('logout', 1);
    this.logout();
  }

  /**
   * Return Google token
   */
  getGoogleToken(): Observable<string> {
    return this.createFederatedToken(this.google, (response: Response) => <any>response as Token);
  }

  private createFederatedToken(broker: string, processToken: ProcessTokenResponse): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const tokenUrl = `${this.ssoUrl}/realms/${this.realm}/broker/${broker}/token`;
    headers.set('Authorization', `Bearer ${this.authService.getToken()}`);
    return this.http.get(tokenUrl, { headers: headers })
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
