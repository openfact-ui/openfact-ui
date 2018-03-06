import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable} from 'rxjs/Observable';

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

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private profileUrl: string;
  private usersUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    broadcaster: Broadcaster,
    @Inject(AUTH_API_URL) apiUrl: string) {
    this.profileUrl = apiUrl + '/profile';
    this.usersUrl = apiUrl + '/users';
    this.loggedInUser = this.http
      .get(this.profileUrl, { headers: this.headers })
      .map(response => cloneDeep(response['data'] as User))
      .publishLast()
      .refCount();
  }

  /**
   * Get the User object for a given user id, or null if no user is found
   * @param userId the userId to search for
   */
  getUserByUserId(userId: string): Observable<User> {
    return this.http
      .get(`${this.usersUrl}/${userId}`, { headers: this.headers })
      .map(response => {
        return response['data'] as User;
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
  getUsersBySearchString(filterText: string, limit: number = 10): Observable<User[]> {
    if (filterText && filterText !== '') {
      return this.http
        .get(`${this.usersUrl}/?filterText=${filterText}&limit=${limit}`, { headers: this.headers })
        .map(response => {
          return response['data'] as User[];
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
      .get(`${this.usersUrl}?username=${username}`, { headers: this.headers })
      .map(response => {
        return response['data'] as User[];
      });
  }

}
