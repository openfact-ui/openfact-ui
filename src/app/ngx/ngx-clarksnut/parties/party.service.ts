import { Party } from './../models/party';
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import { Logger } from '../../ngx-base';
import { Observable } from 'rxjs';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';
import { Space } from '../models/space';

@Injectable()
export class PartyService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private usersUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.usersUrl = apiUrl.endsWith('/') ? apiUrl + 'users' : apiUrl + '/users';
  }

  getParties(userId: string, filterText: string, spaces: Space[], limit: number = 5): Observable<Party[]> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('filterText', filterText);
    params.set('limit', limit.toString());
    spaces.forEach((s) => {
      params.set('spaceIds', s.id);
    });

    const url = `${this.usersUrl}/${userId}/parties`;
    return this.http
      .get(url, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response.json().data as Party[];
      });
  }



}
