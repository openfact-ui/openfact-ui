import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable, Subscription } from 'rxjs';

import { Logger } from 'ngo-base';
import { AuthenticationService, Profile, User, UserService } from 'ngo-login-client';
import { SYNC_API_URL } from 'ngo-openfact-sync';

import { cloneDeep } from 'lodash';

// tslint:disable-next-line:max-classes-per-file
export class ExtUser extends User {
  public attributes: ExtProfile;
}

// tslint:disable-next-line:max-classes-per-file
export class ExtProfile extends Profile {
  public contextInformation: any;
  public registrationCompleted: boolean;
  public refreshToken: string;
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class GettingStartedService implements OnDestroy {

  public subscriptions: Subscription[] = [];

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private loggedInUser: User;
  private usersUrl: string;

  constructor(
    private auth: AuthenticationService,
    private http: Http,
    private logger: Logger,
    private userService: UserService,
    @Inject(SYNC_API_URL) apiUrl: string) {
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
          // tslint:disable-next-line:max-line-length
          profile.attributes.contextInformation = (user as ExtUser).attributes.contextInformation || {};
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
      .get(url, { headers: this.headers, withCredentials: true })
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
  public update(profile: ExtProfile): Observable<ExtUser> {
    let payload = JSON.stringify({
      data: {
        attributes: profile,
        type: 'identities'
      }
    });
    return this.http
      .patch(this.usersUrl, payload, { headers: this.headers, withCredentials: true })
      .map((response) => {
        return response.json().data as ExtUser;
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
