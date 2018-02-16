import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs';

import { cloneDeep } from 'lodash';

import { CLARKSNUT_MAIL_COLLECTOR_API_URL } from './../api/clarksnut-mail-collector-api';
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

  constructor(
    private http: Http,
    @Inject(CLARKSNUT_MAIL_COLLECTOR_API_URL) apiUrl: string) {
    this.userUrl = apiUrl + '/user';
    this.usersUrl = apiUrl + '/users';
    this.loggedInUser = this.http
      .get(this.userUrl, { headers: this.headers })
      .map(response => cloneDeep(response.json().data as User))
      .publishLast()
      .refCount();
  }

}
