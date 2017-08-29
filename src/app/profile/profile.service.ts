import { Http, Headers } from '@angular/http';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, ConnectableObservable } from 'rxjs';
import { cloneDeep } from 'lodash';

import { Broadcaster } from 'ngo-base';
import { SYNC_API_URL } from 'ngo-openfact-sync';
import { Profile, User, UserService } from 'ngo-login-client';

export class ExtUser extends User {
    attributes: ExtProfile;
}

export class ExtProfile extends Profile {
    store: any;
}

/*
 * A service that manages the users profile
 *
 */
@Injectable()
export class ProfileService {

    private static readonly HEADERS: Headers = new Headers({ 'Content-Type': 'application/json' });
    private profileUrl: string;
    private _profile: ConnectableObservable<ExtProfile>;

    constructor(
        private router: Router,
        private broadcaster: Broadcaster,
        userService: UserService,
        @Inject(SYNC_API_URL) apiUrl: string,
        private http: Http
    ) {

    }

    get current(): Observable<ExtProfile> {
        return this._profile;
    }

    save(profile: Profile) {

    }

    silentSave(profile: Profile) {

    }

    get sufficient(): Observable<boolean> {
        return null;
    }

}
