import { ExtProfile, ProfileService } from './../profile/profile.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Broadcaster } from 'ngo-base';
import { User, UserService, Entity } from 'ngo-login-client';
import {
  Space,
  Context,
  Contexts,
  ContextTypes,
  SpaceService,
  SpaceNamePipe
} from 'ngo-openfact-sync';
import { NotificationService, Notification, NotificationType, Action } from 'patternfly-ng';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs';

import { LocalStorageService } from 'angular-2-local-storage';
import { Navigation } from './../models/navigation';
import { MenusService } from '../layout/header/menus.service';

import { EventService } from './event.service';

interface RawContext {
  user: any;
  space: any;
  url: string;
}

/*
 * A shared service that manages the users current context. The users context is defined as the
 * user (user or org) and space that they are operating on.
 */
@Injectable()
export class ContextService implements Contexts {

  public readonly RECENT_CONTEXT_LENGTH = 8;
  public readonly RESERVED_WORDS: string[] = [];
  private _current: Subject<Context> = new ReplaySubject<Context>(1);
  private _default: ConnectableObservable<Context>;
  private _recent: ConnectableObservable<Context[]>;
  private _addRecent: Subject<Context>;
  private _deleteFromRecent: Subject<Context>;

  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private menus: MenusService,
    private spaceService: SpaceService,
    private userService: UserService,
    private notifications: NotificationService,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private spaceNamePipe: SpaceNamePipe,
    private eventService: EventService) {

    this._addRecent = new Subject<Context>();
    this._deleteFromRecent = new Subject<Context>();

    // subscribe to delete space event
    this.eventService.deleteSpaceSubject
      .map((val) => {
        if (val && val.id) {
          return {
            user: null,
            space: val,
            type: ContextTypes.BUILTIN.get('user'),
            name: 'TO_DELETE',
            path: null
          } as Context;
        } else {
          return {} as Context;
        }
      })
      .subscribe((val) => {
        this._deleteFromRecent.next(val);
      });

    // Initialize the default context when the logged in user changes
    this._default = this.userService.loggedInUser
      // First use map to convert the broadcast event to just a username
      .map((val) => {
        if (!(val && val.id)) {
          // this is a logout event
        } else if (val.attributes.username) {
          return val.attributes.username;
        } else {
          this.notifications.message(NotificationType.DANGER, 'Error',
            'Something went badly wrong. Please try again later or ask for help.', true, null, []
          );
          console.log('No username attached to user', val);
          throw 'Unknown user';
        }
      })
      .distinctUntilChanged()
      // Then, perform another map to create a context from the user
      .switchMap((val) => this.userService.getUserByUsername(val))
      .map((val) => {
        if (val && val.id) {
          return {
            user: val,
            space: null,
            type: ContextTypes.BUILTIN.get('user'),
            name: val.attributes.username,
            path: '/' + val.attributes.username
          } as Context;
        } else {
          return {} as Context;
        }
      })
      // Ensure the menus are built
      .do((val) => {
        if (val.type) {
          this.menus.attach(val);
        }
      })
      .do((val) => {
        if (val.type) {
          console.log('Default Context Changed to', val);
          this.broadcaster.broadcast('defaultContextChanged', val);
        }
      })
      .do((val) => {
        if (val.type) {
          // Add to the recent contexts
          // TODO WARNING: THIS WAS OMMITED IN ORDER TO MAKE HEADER WORKS
          //this._addRecent.next(val);
        }
      })
      .multicast(() => new ReplaySubject(1));

    // Create the recent space list
    this._recent = Observable.merge(this._addRecent, this._deleteFromRecent)
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours

      // The final value to scan is the initial value, used when the app starts
      .scan(this.updateRecentSpaceList, [])
      // Finally save the list of recent contexts
      .do((val) => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > this.RECENT_CONTEXT_LENGTH) {
          val.splice(
            this.RECENT_CONTEXT_LENGTH,
            val.length - this.RECENT_CONTEXT_LENGTH
          );
        }
      })
      .do((val) => {
        this.saveRecent(val);
      })
      .multicast(() => new ReplaySubject(1));

    // Finally, start broadcasting
    this._default.connect();
    this._recent.connect();
    this.loadRecent().subscribe(
      (val) => {
        let toto = val;
        val.forEach((space) => this._addRecent.next(space));
      }
    );
  }

  get recent(): Observable<Context[]> {
    return this._recent;
  }

  get current(): Observable<Context> {
    return this._current;
  }

  get default(): Observable<Context> {
    return this._default;
  }

  public updateRecentSpaceList(contextList: Context[], ctx: Context): Context[] {
    return null;
  }

  public changeContext(navigation: Observable<Navigation>): Observable<Context> {
    return null;
  }

  private buildContext(val: RawContext) {
    // TODO Support other types of user
    let c: Context;
    if (val.space) {
      c = {
        'user': val.space.relationalData.creator,
        'space': val.space,
        'type': null,
        'name': null,
        'path': null
      } as Context;
      c.type = ContextTypes.BUILTIN.get('space');
      c.path = '/' + c.user.attributes.username + '/' + c.space.attributes.name;
      c.name = this.spaceNamePipe.transform(c.space.attributes.name);
    } else if (val.user) {
      c = {
        'user': val.user,
        'space': null,
        'type': null,
        'name': null,
        'path': null
      } as Context;
      c.type = ContextTypes.BUILTIN.get('user');
      // TODO replace path with username once parameterized routes are working
      c.path = '/' + c.user.attributes.username;
      c.name = c.user.attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != null) {
      this.menus.attach(c);
      return c;
    }
  }

  private extractUser(): string {
    return null;
  }

  private loadUser(userName: string): Observable<User> {
    return null;
  }

  // tslint:disable-next-line:member-ordering
  public extractSpace(): string {
    return null;
  }

  private getRouteParams(): any {
    return null;
  }

  private loadSpace(userName: string, spaceName: string): Observable<Space> {
    return null;
  }

  private checkForReservedWords(arg: string): boolean {
    return false;
  }

  private loadRecent(): Observable<Context[]> {
    return this.profileService.current.switchMap((profile) => {
      if (profile.store.recentContexts) {
        return Observable.forkJoin((profile.store.recentContexts as RawContext[])
          // We invert the order above when we add recent contexts
          .reverse()
          .map((raw) => {
            if (raw.space) {
              return this.spaceService.getSpaceById(raw.space)
                .map((val) => this.buildContext({ space: val } as RawContext));
            } else {
              return this.userService.getUserByUserId(raw.user)
                .catch((err) => {
                  console.log('Unable to restore recent context', err);
                  return Observable.empty<Context>();
                })
                .map((val) => {
                  return this.buildContext({ user: val } as RawContext);
                });
            }
          }));
      } else {
        return Observable.of([]);
      }
    });
  }

  private saveRecent(recent: Context[]) {

  }

}
