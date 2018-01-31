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
  private namedSpacesUrl: string;
  private searchSpacesUrl: string;
  private nextLink: string = null;

  constructor(
    private http: Http,
    private logger: Logger,
    private auth: AuthenticationService,
    private userService: UserService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.spacesUrl = apiUrl.endsWith('/') ? apiUrl + 'spaces' : apiUrl + '/spaces';
    this.namedSpacesUrl = apiUrl.endsWith('/') ? apiUrl + 'namedspaces' : apiUrl + '/namedspaces';
    this.searchSpacesUrl = apiUrl.endsWith('/') ? apiUrl + 'search/space' : apiUrl + '/search/space';
  }

  getSpaces(pageSize: number = 20): Observable<Space[]> {
    let url = this.spacesUrl + '?page[limit]=' + pageSize;
    return this.getSpacesDelegate(url, true);
  }

  getMoreSpaces(): Observable<Space[]> {
    if (this.nextLink) {
      return this.getSpacesDelegate(this.nextLink, false);
    } else {
      return Observable.throw('No more spaces found');
    }
  }

  getSpaceByAssignedId(spaceAssignedId: string): Observable<Space> {
    let url = this.spacesUrl;
    let params: URLSearchParams = new URLSearchParams();
    params.set('assignedId', spaceAssignedId);

    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response.json().data as Space[];
      })
      .map(space => {
        for (let s of space) {
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

  getSpacesDelegate(url: string, isAll: boolean): Observable<Space[]> {
    return this.http
      .get(url, { headers: this.headers })
      .map(response => {
        // Extract links from JSON API response.
        // and set the nextLink, if server indicates more resources
        // in paginated collection through a 'next' link.
        let links = response.json().links;
        if (links.hasOwnProperty('next')) {
          this.nextLink = links.next;
        } else {
          this.nextLink = null;
        }
        // Extract data from JSON API response, and assert to an array of spaces.
        let newSpaces: Space[] = response.json().data as Space[];
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

  create(space: Space): Observable<Space> {
    let url = this.spacesUrl;
    let payload = JSON.stringify({ data: space });
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

  update(space: Space): Observable<Space> {
    let url = `${this.spacesUrl}/${space.id}`;
    let payload = JSON.stringify({ data: space });
    return this.http
      .patch(url, payload, { headers: this.headers })
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

  deleteSpace(space: Space): Observable<Space> {
    let url = `${this.spacesUrl}/${space.id}`;
    return this.http
      .delete(url, { headers: this.headers })
      .map(() => { })
      .catch((error) => {
        return this.handleError(error);
      });
  }

  search(searchText: string): Observable<Space[]> {
    let url = this.searchSpacesUrl;
    let params: URLSearchParams = new URLSearchParams();
    if (searchText === '') {
      searchText = '*';
    }
    params.set('q', searchText);

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

  // Currently serves to fetch the list of all spaces owned by a user.
  getSpacesByUser(userName: string, pageSize: number = 20): Observable<Space[]> {
    let url = `${this.namedSpacesUrl}/${userName}` + '?page[limit]=' + pageSize;
    let isAll = false;
    return this.getSpacesDelegate(url, isAll);
  }

  getMoreSpacesByUser(): Observable<Space[]> {
    if (this.nextLink) {
      return this.getSpacesDelegate(this.nextLink, false);
    } else {
      return Observable.throw('No more spaces found');
    }
  }

  getSpaceById(spaceId: string): Observable<Space> {
    let url = `${this.spacesUrl}/${spaceId}`;
    return this.http.get(url, { headers: this.headers })
      .map((response) => {
        return response.json().data as Space;
      })
      .switchMap(val => this.resolveOwner(val))
      .catch((error) => {
        return this.handleError(error);
      });
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }

  private resolveOwner(space: Space): Observable<Space> {
    space.relationalData = space.relationalData || {};

    if (!space.relationships.ownedBy || space.relationships.ownedBy.length === 0) {
      space.relationalData.owners = [];
      return;
    }

    return Observable.forkJoin(
      Observable.from(space.relationships.ownedBy)
        .switchMap((val) => this.userService.getUserByUserId(val.data.id))
    ).map((owners) => {
      space.relationalData.owners = owners;
      return space;
    });
  }

  private resolveOwners(spaces: Space[]): Observable<Space[]> {
    return Observable
      // Get a stream of spaces
      .from(spaces)
      // Map to a stream of owner Ids of these spaces
      .map(space => {
        let ownerIds: string[] = space.relationships.ownedBy.map((val) => val.data.id);
        return [].concat.apply([], ownerIds)
      })
      // Get only the unique owners in this stream of owner Ids
      .distinct()
      // Get the users from the server based on the owner Ids
      // and flatten the resulting stream , observables are returned
      .flatMap(ownerId => {
        return this.userService.getUserByUserId(ownerId).catch(err => {
          console.log('Error fetching user', ownerId, err);
          return Observable.empty<User>();
        })
      })
      // map the user objects back to the spaces to return a stream of spaces
      .map(owner1 => {
        if (owner1) {
          for (let space of spaces) {
            space.relationalData = space.relationalData || {};

            let ownedBy = space.relationships.ownedBy;
            for (let owner2 of ownedBy) {
              if (owner1.id === owner2.data.id) {
                if (!space.relationalData.owners) {
                  space.relationalData.owners = [];
                }
                space.relationalData.owners.push(owner1);
              }
            }

          }
        }
        return spaces;
      });
  }

}
