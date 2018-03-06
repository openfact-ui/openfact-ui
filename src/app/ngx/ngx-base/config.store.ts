import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { ValWrapper } from './val-wrapper';

export type LoadCallback<T> = (json: any) => T;

@Injectable()
export class ConfigStore {

  private _cache: Map<string, Observable<ValWrapper<any>>> = new Map();

  constructor(
    private http: HttpClient
  ) { }

  get<T>(name: string, load?: LoadCallback<T>): Observable<ValWrapper<T>> {
    if (this._cache.has(name)) {
      return this._cache
        .get(name);
    } else {
      const res = this.http
        .get(`/_config/${name}.config.json`)
        .map(json => {
          return {
            val: (json as any),
            loading: false
          } as ValWrapper<T>;
        })
        .do(config => console.log('Config loaded', config))
        .publishReplay(1);
      this._cache.set(name, res);
      res.connect();
      return res;
    }
  }

  clear() {
    this._cache = new Map();
  }
}
