import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { cloneDeep } from 'lodash';
import { AuthenticationService, User, UserService } from '../../ngx-login-client';
import { Logger } from '../../ngx-base';
import { Observable } from 'rxjs';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';
import { Space } from '../models/space';

@Injectable()
export class SpaceService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private spacesUrl: string;
  private usersUrl: string;

  private nextLinkOwnedNamedSpaces: string = null;
  private nextLinkOwnedCollaboratedSpaces: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    private userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.spacesUrl = apiUrl.endsWith('/') ? apiUrl + 'spaces' : apiUrl + '/spaces';
    this.usersUrl = apiUrl.endsWith('/') ? apiUrl + 'users' : apiUrl + '/users';
  }

  /**
   * Get public version of space
   * @param spaceId spaceId
   */
  getSpaceById(spaceId: string): Observable<Space> {
    const url = `${this.spacesUrl}/${spaceId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as Space;
      })
      .switchMap(val => this.resolveOwner(val))
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Search public version of space
   * @param spaceAssignedId space assignedId
   */
  getSpaceByAssignedId(spaceAssignedId: string): Observable<Space> {
    const url = this.spacesUrl;
    const params: URLSearchParams = new URLSearchParams();
    params.set('assignedId', spaceAssignedId);

    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response.json().data as Space[];
      })
      .map(space => {
        for (const s of space) {
          if (spaceAssignedId === s.attributes.assignedId) {
            return s;
          }
        }
        return null;
      })
      .switchMap(space => {
        if (space) {
          return this.resolveOwner(space);
        } else {
          return Observable.of(space);
        }
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Create new space
   * @param space space
   */
  create(space: Space): Observable<Space> {
    const url = this.spacesUrl;
    const payload = JSON.stringify({ data: space });
    return this.http
      .post(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as Space;
      })
      .switchMap(val => {
        return this.resolveOwner(val);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Update space as 'me' user
   * @param space space
   */
  update(userId: string, space: Space): Observable<Space> {
    const url = `${this.usersUrl}/${userId}/spaces/${space.id}`;
    const payload = JSON.stringify({ data: space });
    return this.http
      .put(url, payload, { headers: this.headers })
      .map(response => {
        return response.json().data as Space;
      })
      .switchMap(val => {
        return this.resolveOwner(val);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Delete space as 'me' user
   * @param space space
   */
  deleteSpace(userId: string, space: Space): Observable<Space> {
    const url = `${this.usersUrl}/${userId}/spaces/${space.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .map(() => { })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Search space
   * @param filterText Filter text
   * @param limit limit of results
   */
  search(filterText: string, limit: number = 10): Observable<Space[]> {
    const url = this.spacesUrl;
    const params: URLSearchParams = new URLSearchParams();
    if (filterText === '') {
      filterText = '*';
    }
    params.set('filterText', filterText);
    params.set('limit', limit.toString());

    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response.json().data as Space[];
      })
      .switchMap(spaces => {
        return this.resolveOwners(spaces);
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /***
   * NamedSpaces
   */

   /**
    *
    */
  getOwnedSpacesByUserId(userId: string, limit: number = 10): Observable<Space[]> {
    const url = `${this.usersUrl}/${userId}/spaces` + '?role=owner&limit=' + limit;
    const isAll = false;
    return this.getOwnedSpacesDelegate(url, isAll);
  }

  getMoreOwnedSpaces(): Observable<Space[]> {
    if (this.nextLinkOwnedNamedSpaces) {
      return this.getOwnedSpacesDelegate(this.nextLinkOwnedNamedSpaces, false);
    } else {
      return Observable.throw('No more spaces found');
    }
  }

  private getOwnedSpacesDelegate(url: string, isAll: boolean): Observable<Space[]> {
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        const links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLinkOwnedNamedSpaces = links.next;
        } else {
          this.nextLinkOwnedNamedSpaces = null;
        }
        // Extract data from JSON API response, and assert to an array of spaces.
        const newSpaces: Space[] = response.json().data as Space[];
        return newSpaces;
      })
      .switchMap(spaces => {
        if (spaces.length) {
          return this.resolveOwners(spaces);
        } else {
          return Observable.of(spaces);
        }
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  getCollaboratedSpacesByUserId(userId: string, limit: number = 20): Observable<Space[]> {
    const url = `${this.usersUrl}/${userId}/spaces` + '?role=collaborator&limit=' + limit;
    const isAll = false;
    return this.getCollaboratedSpacesDelegate(url, isAll);
  }

  getMoreCollaboratedSpaces(): Observable<Space[]> {
    if (this.nextLinkOwnedCollaboratedSpaces) {
      return this.getCollaboratedSpacesDelegate(this.nextLinkOwnedCollaboratedSpaces, false);
    } else {
      return Observable.throw('No more spaces found');
    }
  }

  private getCollaboratedSpacesDelegate(url: string, isAll: boolean): Observable<Space[]> {
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        const links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLinkOwnedCollaboratedSpaces = links.next;
        } else {
          this.nextLinkOwnedCollaboratedSpaces = null;
        }
        // Extract data from JSON API response, and assert to an array of spaces.
        const newSpaces: Space[] = response.json().data as Space[];
        return newSpaces;
      })
      .switchMap(spaces => {
        if (spaces.length) {
          return this.resolveOwners(spaces);
        } else {
          return Observable.of(spaces);
        }
      })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  /**
   * Private
   */

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

  private resolveOwner(space: Space): Observable<Space> {
    space.relationalData = space.relationalData || {};

    if (!space.relationships.ownedBy) {
      space.relationalData.owner = {} as User;
      return Observable.of(space);
    }

    return this.userService
      .getUserByUserId(space.relationships.ownedBy.data.id)
      .map(owner => {
        space.relationalData.owner = owner;
        return space;
      });
  }

  private resolveOwners(spaces: Space[]): Observable<Space[]> {
    return Observable
      // Get a stream of spaces
      .from(spaces)
      // Map to a stream of owner Ids of these spaces
      .map(space => space.relationships.ownedBy.data.id)
      // Get only the unique owners in this stream of owner Ids
      .distinct()
      // Get the users from the server based on the owner Ids
      // and flatten the resulting stream , observables are returned
      .flatMap(ownerId => {
        return this.userService.getUserByUserId(ownerId).catch(err => {
          console.log('Error fetching user', ownerId, err);
          return Observable.empty<User>();
        });
      })
      // map the user objects back to the spaces to return a stream of spaces
      .map(owner => {
        if (owner) {
          for (let space of spaces) {
            space.relationalData = space.relationalData || {};
            if (owner.id === space.relationships.ownedBy.data.id) {
              space.relationalData.owner = owner;
            }
          }
        }
        return spaces;
      });
  }

}
