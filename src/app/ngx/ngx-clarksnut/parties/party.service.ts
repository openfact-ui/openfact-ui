import { Party } from './../models/party';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Logger } from '../../ngx-base';
import { Observable } from 'rxjs/Observable';

import { CLARKSNUT_API_URL } from '../api/clarksnut-api';
import { Space } from '../models/space';

@Injectable()
export class PartyService {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private usersUrl: string;

  constructor(
    private http: HttpClient,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.usersUrl = apiUrl.endsWith('/') ? apiUrl + 'users' : apiUrl + '/users';
  }

  getParties(userId: string, filterText: string, spaces: Space[], limit: number = 5): Observable<Party[]> {
    let params: HttpParams = new HttpParams();
    params = params.set('filterText', filterText);
    params = params.set('limit', limit.toString());
    spaces.forEach((s) => {
      params = params.set('spaceIds', s.id);
    });

    const url = `${this.usersUrl}/${userId}/parties`;
    return this.http
      .get(url, { headers: this.headers, params: params })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response['data'] as Party[];
      });
  }



}
