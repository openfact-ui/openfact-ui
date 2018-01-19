import { NotificationService, NotificationType } from 'patternfly-ng';
import { Http, Headers } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, ConnectableObservable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { Broadcaster } from 'ngo-base';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { Profile, User, UserService } from 'ngo-login-client';

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

  private static readonly HEADERS: Headers = new Headers({ 'Content-Type': 'application/json' });
  private profileUrl: string;
  private _profile: ConnectableObservable<ExtProfile>;

  constructor(private router: Router,
    private broadcaster: Broadcaster,
    private notifications: NotificationService,
    userService: UserService,
    @Inject(SYNC_API_URL) apiUrl: string,
    private http: Http) {
    this.profileUrl = apiUrl + 'users';
    this._profile = userService.loggedInUser
      .skipWhile((user) => {
        return !user || !user.attributes;
      })
      .map((user) => cloneDeep(user) as ExtUser)
      .do((user) => {
        if (user.attributes) {
          user.attributes.store = (user as any).attributes.contextInformation || {};
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
    let clone = cloneDeep(profile) as any;
    delete clone.username;
    // Handle the odd naming of the field on the API
    clone.contextInformation = clone.store;
    delete clone.store;
    let payload = JSON.stringify({
      data: {
        attributes: clone,
        type: 'identities'
      }
    });
    return this.http
      .patch(this.profileUrl, payload, {
        headers: ProfileService.HEADERS,
        withCredentials: true
      })
      .map((response) => {
        return response.json().data as User;
      });
  }

  get sufficient(): Observable<boolean> {
    return this.current.map((current) => {
      if (current &&
        current.fullName &&
        current.email &&
        current.username
        // TODO Add imageURL
        //this.current.imageURL
      ) {
        return true;
      } else {
        return false;
      }
    });
  }

}
