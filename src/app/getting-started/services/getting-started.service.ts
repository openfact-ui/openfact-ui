import { ExtUser } from './ext-user';
import { ExtProfile } from './ext-profile';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import { Logger } from 'ngo-base';
import { AuthenticationService, Profile, User, UserService } from 'ngo-login-client';
import { SYNC_API_URL } from 'ngo-openfact-sync';

import { cloneDeep } from 'lodash';

@Injectable()
export class GettingStartedService implements OnDestroy {

  public subscriptions: Subscription[] = [];

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  private userUrl: string;
  private usersUrl: string;

  constructor(
    private auth: AuthenticationService,
    private http: Http,
    private logger: Logger,
    private userService: UserService,
    @Inject(SYNC_API_URL) apiUrl: string) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    this.userUrl = apiUrl + 'user';
    this.usersUrl = apiUrl + 'users';
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public createTransientProfile(): ExtProfile {
    let profile: ExtUser;

    this.userService.loggedInUser
      .map((user) => {
        profile = cloneDeep(user) as ExtUser;
        if (profile.attributes !== undefined) {
          profile.attributes.contextInformation
            = (user as ExtUser).attributes.contextInformation || {};
        }
      })
      .publish().connect();

    return profile.attributes;
  }

  /**
   * Get extended profile for given user ID
   *
   * @param id The user ID
   * @returns {Observable<ExtUser>}
   */
  public getExtProfile(id: string): Observable<ExtUser> {
    let url = `${this.usersUrl}/${id}`;
    return this.http
      .get(url, { headers: this.headers })
      .map((response) => {
        return response.json() as ExtUser;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Update user profile
   *
   * @param profile The extended profile used to apply context information
   * @returns {Observable<User>}
   */
  public update(profile: ExtProfile): Observable<ExtUser> {
    let payload = JSON.stringify({
      data: {
        attributes: profile,
        type: 'identities'
      }
    });
    return this.http
      .put(this.usersUrl, payload, { headers: this.headers })
      .map((response) => {
        return response.json().data as ExtUser;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Update user profile
   *
   * @param profile The extended profile used to apply context information
   * @returns {Observable<User>}
   */
  public updateCurrentUser(profile: ExtProfile): Observable<ExtUser> {
    return this.http
      .put(this.userUrl, profile, { headers: this.headers })
      .map((response) => {
        return response.json() as ExtUser;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  // Private
  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
