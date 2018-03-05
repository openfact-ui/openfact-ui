import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams, Response } from '@angular/http';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';

import { Logger } from '../../ngx-base';
import { AuthenticationService, User, UserService } from '../../ngx-login-client';
import { Space } from './../models/space';
import { CLARKSNUT_API_URL } from '../api/clarksnut-api';

import { SpaceService } from './../spaces/space.service';
import { RequestAccessToSpace } from '../models/request-access-to-space';

@Injectable()
export class RequestAccessService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private requestsUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    private spaceService: SpaceService,
    private userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.requestsUrl = apiUrl.endsWith('/') ? apiUrl + 'request-access' : apiUrl + '/request-access';
  }

  getByCurrentUser(): Observable<RequestAccessToSpace[]> {
    const url = this.requestsUrl;
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        return response.json().data as RequestAccessToSpace[];
      })
      .switchMap((requests) => {
        return this.resolveSpaces(requests);
      })
      .switchMap((requests) => {
        return this.resolveUsers(requests);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  addRequestAccess(request: RequestAccessToSpace): Observable<RequestAccessToSpace> {
    const payload = JSON.stringify({ data: request });
    return this.http
      .post(this.requestsUrl, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as RequestAccessToSpace;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  updateRequest(request: RequestAccessToSpace): Observable<RequestAccessToSpace> {
    const url = `${this.requestsUrl}/${request.id}`;
    const payload = JSON.stringify({
      data: {
        attributes: request.attributes,
        type: 'request'
      }
    });
    return this.http
      .put(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as RequestAccessToSpace;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private resolveSpace(request: RequestAccessToSpace): Observable<RequestAccessToSpace> {
    request.relationalData = request.relationalData || {};

    if (!request.attributes.space || request.attributes.space.length === 0) {
      request.relationalData.spaceRequested = {} as Space;
      return;
    }

    return this.spaceService
      .getSpaceById(request.attributes.space)
      .map((space) => {
        request.relationalData.spaceRequested = space;
        return request;
      });
  }

  private resolveSpaces(requests: RequestAccessToSpace[]): Observable<RequestAccessToSpace[]> {
    if (requests.length === 0) {
      return Observable.of(requests);
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
        return requests;
      });
  }

  private resolveUsers(requests: RequestAccessToSpace[]): Observable<RequestAccessToSpace[]> {
    if (requests.length === 0) {
      return Observable.of(requests);
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
        return requests;
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
