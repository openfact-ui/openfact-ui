// import { ProfileService, ExtProfile } from './../profile/profile.service';
import { Broadcaster } from 'ngo-base';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Spaces, Contexts, Space, SpaceService } from 'ngo-openfact-sync';

@Injectable()
export class SpacesService implements Spaces {

    public static readonly RECENT_SPACE_LENGTH = 8;
    private static readonly RECENT_SPACE_KEY = 'recentSpaceIds';

    public addRecent: Subject<Space> = new Subject<Space>();
    private _current: Observable<Space>;
    private _recent: ConnectableObservable<Space[]>;

    constructor() { }

    get current(): Observable<Space> {
        return this._current;
    }

    get recent(): Observable<Space[]> {
        return this._recent;
    }

    private loadRecent(): Observable<Space[]> {
        return null;
    }

    private saveRecent(recent: Space[]) { }

}
