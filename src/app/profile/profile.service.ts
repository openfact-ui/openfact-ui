import { NotificationService, NotificationType } from 'patternfly-ng/notification';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';

import { cloneDeep } from 'lodash';

import { Broadcaster } from '../ngx/ngx-base';
import { Profile, User, UserService } from '../ngx/ngx-login-client';
import { CLARKSNUT_API_URL } from '../ngx/ngx-clarksnut';

export class ExtUser extends User {
  public attributes: ExtProfile;
}

// tslint:disable-next-line:max-classes-per-file
export class ExtProfile extends Profile {
  public store: any;
}

/*
 * A service that manages the users profile
 *
 */

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class ProfileService {

  private static readonly HEADERS = new HttpHeaders({ 'Content-Type': 'application/json' });
  private profileUrl: string;
  private _profile: ConnectableObservable<ExtProfile>;

  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private notifications: NotificationService,
    userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string,
    private http: HttpClient) {
    this.profileUrl = apiUrl.endsWith('/') ? apiUrl + 'profile' : apiUrl + '/profile';
    this._profile = userService.loggedInUser
      .skipWhile((user) => {
        return !user || !user.attributes;
      })
      .map((user) => cloneDeep(user) as ExtUser)
      .do((user) => {
        if (user.attributes) {
          user.attributes.store = {};
        } else {
          user.attributes = {
            fullName: '',
            imageURL: '',
            username: '',
            store: {}
          };
        }
      })
      .map((user) => user.attributes)
      .publishReplay(1);
    this._profile.connect();
  }

  get current(): Observable<ExtProfile> {
    return this._profile;
  }

  public save(profile: Profile) {
    return this.silentSave(profile).do((val) => {
      this.notifications.message(NotificationType.SUCCESS, 'Success',
        'User profile updated', false, null, []);
    }).catch((error) => {
      this.notifications.message(NotificationType.DANGER, 'Error',
        'Ooops, something went wrong, your profile was not updated', false, null, []);
      console.log('Error updating user profile', error);
      return Observable.empty();
    });
  }

  public silentSave(profile: Profile) {
    const clone = cloneDeep(profile) as any;
    delete clone.username;
    // Handle the odd naming of the field on the API
    delete clone.store;
    const payload = JSON.stringify({
      data: {
        attributes: clone,
        type: 'identities'
      }
    });
    return this.http
      .put(this.profileUrl, payload, {
        headers: ProfileService.HEADERS,
        withCredentials: true
      })
      .map((response) => {
        return response['data'] as User;
      });
  }

  get sufficient(): Observable<boolean> {
    return this.current.map((current) => {
      if (current &&
        current.fullName &&
        current.email &&
        current.username
        // TODO Add imageURL
        // this.current.imageURL
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

}
