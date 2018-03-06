import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Logger } from '../../ngx/ngx-base';
import { Profile, User, UserService } from '../../ngx/ngx-login-client';
import { CLARKSNUT_API_URL } from '../../ngx/ngx-clarksnut';

import { cloneDeep } from 'lodash';

export class ExtUser extends User {
  attributes: ExtProfile;
}

export class ExtProfile extends Profile {
  registrationCompleted: boolean;
  ownedSpaces: string[];
  collaboratedSpaces: string[];
  favoriteSpaces: string[];
  defaultLanguage: string;
}

@Injectable()
export class GettingStartedService implements OnDestroy {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  subscriptions: Subscription[] = [];
  private profileUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.profileUrl = apiUrl.endsWith('/') ? apiUrl + 'profile' : apiUrl + '/profile';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  createTransientProfile(): ExtProfile {
    let profile: ExtUser;

    this.userService.loggedInUser
      .map(user => {
        profile = cloneDeep(user) as ExtUser;
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
  getExtProfile(id: string): Observable<ExtUser> {
    const url = `${this.profileUrl}/${id}`;
    return this.http
      .get(url, {
        headers: this.headers
      })
      .map(response => {
        return response['data'] as ExtUser;
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
  update(profile: ExtProfile): Observable<ExtUser> {
    const payload = JSON.stringify({
      data: {
        attributes: profile,
        type: 'identities'
      }
    });
    return this.http
      .put(this.profileUrl, payload, { headers: this.headers })
      .map(response => {
        return response['data'] as ExtUser;
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
