import {ActivatedRoute} from '@angular/router';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthenticationService} from 'ngo-login-client';
import {LoginService} from '../login.service';
import {Http, Headers} from '@angular/http';
import {SYNC_API_URL} from 'ngo-openfact-sync';

@Injectable()
export class OpenfactRuntimeConsoleService {

  private headers = new Headers({'Content-Type': 'application/json'});
  private checkUrl: string;

  constructor(private login: LoginService,
              private auth: AuthenticationService,
              private http: Http,
              @Inject(SYNC_API_URL) syncApiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.checkUrl = syncApiUrl + 'check_token';
  }

  public loadingKcToken(): Observable<boolean> {
    return this.http
      .get(this.checkUrl, {headers: this.headers})
      .map((response) => {
        return response.status === 200;
      })
      .catch((error) => {
        return Observable.of(false);
      });
  }

}
