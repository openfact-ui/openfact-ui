import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable, ConnectableObservable, ReplaySubject, Subject, BehaviorSubject } from 'rxjs';

import { cloneDeep } from 'lodash';
import { Broadcaster, Logger } from '../../ngx-base';

import { AUTH_API_URL } from '../shared/auth-api';
import { User } from './user';

import 'rxjs/add/operator/multicast';

/**
 *  Provides user and user list methods to retrieve current or user list details
 *
 *  The UserService should be injected at the root of the application to ensure it is a singleton
 *  getUser and getAllUsers return observables that can be subscribed to for information
 */
@Injectable()
export class UserService {

  /**
   * The currently logged in user
   */
  public loggedInUser: Observable<User>;

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private userUrl: string;  // URL to web api
  private usersUrl: string;  // URL to web api
  private searchUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    broadcaster: Broadcaster,
    @Inject(AUTH_API_URL) apiUrl: string) {
    this.userUrl = apiUrl + '/user';
    this.usersUrl = apiUrl + '/users';
    this.searchUrl = apiUrl + '/search';
    this.loggedInUser = this.http
      .get(this.userUrl, { headers: this.headers })
      .map(response => cloneDeep(response.json().data as User))
      .publishLast()
      .refCount();
      //.multicast(() => new ReplaySubject(1));
    //this.loggedInUser.connect();
  }

  /**
   * Get the User object for a given user id, or null if no user is found
   * @param userId the userId to search for
   */
  getUserByUserId(userId: string): Observable<User> {
    return this.http
      .get(`${this.usersUrl}/${userId}`, { headers: this.headers })
      .map(response => {
        return response.json().data as User;
      });
  }

  /**
   * Get the User object for a given username, or null if no user is found
   * @param username the username to search for
   */
  getUserByUsername(username: string): Observable<User> {
    return this.filterUsersByUsername(username).map(val => {
      for (const u of val) {
        if (username === u.attributes.username) {
          return u;
        }
      }
      return null;
    });
  }

  /**
   * Get users by a search string
   */
  getUsersBySearchString(search: string): Observable<User[]> {
    if (search && search !== '') {
      return this.http
        .get(this.searchUrl + '/users?q=' + search, { headers: this.headers })
        .map(response => {
          return response.json().data as User[];
        });
    }
    return Observable.of([] as User[]);
  }

  /**
   *
   * Filter users by username
   *
   * @returns Observable<User[]>
   */
  filterUsersByUsername(username: string): Observable<User[]> {
    return this.http
      .get(`${this.usersUrl}?filter[username]=${username}`, { headers: this.headers })
      .map(response => {
        return response.json().data as User[];
      });
  }

}
