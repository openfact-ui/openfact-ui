import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Logger } from '../../../ngx/ngx-base';
import { UserService, User } from './../../../ngx/ngx-login-client';
import { SpaceService, Space, RequestAccessToSpace, CLARKSNUT_API_URL } from '../../../ngx/ngx-clarksnut';

import { cloneDeep } from 'lodash';

export class UserNotifications {
  type: string;
  attributes: UserNotificationsAttributes;
}

export class UserNotificationsAttributes {
  requestAccesses: RequestAccessToSpace[];
}

@Injectable()
export class UserNotificationsService implements OnDestroy {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private subscriptions: Subscription[] = [];
  private usersUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    private spaceService: SpaceService,
    private userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.usersUrl = apiUrl.endsWith('/') ? apiUrl + 'users' : apiUrl + '/users';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Get extended profile for given user ID
   *
   * @param id The user ID
   * @returns {Observable<ExtUser>}
   */
  getUserNotifications(userId: string, status: string): Observable<UserNotifications> {
    const url = `${this.usersUrl}/${userId}/notifications`;
    return this.http
      .get(url, {
        headers: this.headers
      })
      .map(response => {
        return response['data'] as UserNotifications;
      })
      .switchMap(response => {
        return this.resolveSpaces(response);
      })
      .switchMap(response => {
        return this.resolveUsers(response);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private resolveSpaces(notifications: UserNotifications): Observable<UserNotifications> {
    const requests: RequestAccessToSpace[] = notifications.attributes.requestAccesses;
    if (requests.length === 0) {
      return Observable.of(notifications);
    }

    return Observable
      .from(requests)
      .map(request => request.attributes.space)
      .distinct()
      .flatMap(spaceId => this.spaceService.getSpaceById(spaceId).catch(err => {
        console.log('Error fetching space', spaceId, err);
        return Observable.empty<Space>();
      }))
      .map(space => {
        if (space) {
          for (const request of requests) {
            request.relationalData = request.relationalData || {};
            if (request.attributes.space === space.id) {
              request.relationalData.spaceRequested = space;
            }
          }
        }
        return notifications;
      });
  }

  private resolveUsers(notifications: UserNotifications): Observable<UserNotifications> {
    const requests: RequestAccessToSpace[] = notifications.attributes.requestAccesses;
    if (requests.length === 0) {
      return Observable.of(notifications);
    }

    return Observable
      .from(requests)
      .map(request => request.attributes.user)
      .distinct()
      .flatMap(userId => this.userService.getUserByUserId(userId).catch(err => {
        console.log('Error fetching user', userId, err);
        return Observable.empty<User>();
      }))
      .map(user => {
        if (user) {
          for (const request of requests) {
            request.relationalData = request.relationalData || {};
            if (request.attributes.user === user.id) {
              request.relationalData.createdBy = user;
            }
          }
        }
        return notifications;
      });
  }

  // Private

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
