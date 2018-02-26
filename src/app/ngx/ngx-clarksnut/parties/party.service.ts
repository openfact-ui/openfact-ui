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
  private partiesUrl: string;

  constructor(
    private http: Http,
    private logger: Logger,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.partiesUrl = apiUrl.endsWith('/') ? apiUrl + 'parties' : apiUrl + '/parties';
  }

  getParties(searchText: string, spaces: Space[], limit: number = 5): Observable<Party[]> {
    const params: URLSearchParams = new URLSearchParams();
    params.set('q', searchText);
    params.set('limit', limit.toString());
    spaces.forEach((s) => {
      params.set('spaceIds', s.id);
    });

    return this.http
      .get(this.partiesUrl, { search: params, headers: this.headers })
      .map(response => {
        // Extract data from JSON API response, and assert to an array of spaces.
        return response.json().data as Party[];
      });
  }



}
