import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { cloneDeep } from 'lodash';
import { Logger } from '../../ngx-base';
import { User } from '../../ngx-login-client';
import { Observable } from 'rxjs/Observable';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';

@Injectable()
export class CollaboratorService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private nextLink: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.spacesUrl = apiUrl.endsWith('/') ? apiUrl + 'spaces' : apiUrl + '/spaces';
  }

  getInitialBySpaceId(spaceId: string, pageSize: number = 20): Observable<User[]> {
    const url = this.spacesUrl + '/' + spaceId + '/collaborators' + '?page[limit]=' + pageSize;
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {

        const links = response['links'];
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }

        const collaborators: User[] = response['data'] as User[];
        return collaborators;
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getNextCollaborators(): Observable<User[]> {
    if (this.nextLink) {
      return this.http
        .get(this.nextLink, { headers: this.headers })
        .map(response => {
          const links = response['links'];
          if (links.hasOwnProperty('next')) {
            this.nextLink = links.next;
          } else {
            this.nextLink = null;
          }

          const collaborators: User[] = response['data'] as User[];
          return collaborators;
        })
        .catch((error) => {
          return this.handleError(error);
        });
    } else {
      return Observable.throw('No more collaborators found');
    }
  }

  addCollaborators(spaceId: string, users: User[]): Observable<Response> {
    const url = this.spacesUrl + '/' + spaceId + '/collaborators';
    const payload = JSON.stringify({ data: users });
    return this.http
      .post(url, payload, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  removeCollaborator(spaceId: string, collaboratorId: string): Observable<void> {
    const url = this.spacesUrl + '/' + spaceId + '/collaborators/' + collaboratorId;
    return this.http
      .delete(url, { headers: this.headers })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

}
