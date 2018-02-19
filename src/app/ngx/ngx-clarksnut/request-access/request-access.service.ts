import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams, Response } from '@angular/http';
import { cloneDeep } from 'lodash';
import { Logger } from '../../ngx-base';
import { AuthenticationService, User } from '../../ngx-login-client';
import { Observable } from 'rxjs';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';

import { RequestAccessToSpace } from '../models/request-access-to-space';

@Injectable()
export class RequestAccessService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private nextLink: string;

  constructor(
    private http: Http,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.spacesUrl = apiUrl.endsWith('/') ? apiUrl + 'spaces' : apiUrl + '/spaces';
  }

  getInitialBySpaceId(spaceId: string, pageSize: number = 20): Observable<RequestAccessToSpace[]> {
    const url = this.spacesUrl + '/' + spaceId + '/request-access' + '?page[limit]=' + pageSize;
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {

        const links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }

        const requests: RequestAccessToSpace[] = response.json().data as RequestAccessToSpace[];
        return requests;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getNextRequests(): Observable<RequestAccessToSpace[]> {
    if (this.nextLink) {
      return this.http
        .get(this.nextLink, { headers: this.headers })
        .map(response => {
          const links = response.json().links;
          if (links.hasOwnProperty('next')) {
            this.nextLink = links.next;
          } else {
            this.nextLink = null;
          }

          const requests: RequestAccessToSpace[] = response.json().data as RequestAccessToSpace[];
          return requests;
        })
        .catch((error) => {
          return this.handleError(error);
        });
    } else {
      return Observable.throw('No more requests found');
    }
  }

  addRequestAccess(spaceId: string, request: RequestAccessToSpace): Observable<Response> {
    const url = this.spacesUrl + '/' + spaceId + '/request-access';
    const payload = JSON.stringify({ data: request });
    return this.http
      .post(url, payload, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
