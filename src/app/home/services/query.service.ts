import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

interface QueryEvent {
  query: string;
}

@Injectable()
export class QueryService {

  private _eventBus: Subject<QueryEvent>;

  constructor() {
    this._eventBus = new Subject<QueryEvent>();
  }

  /**
   * Broadcast an event.
   *
   * @param query.
   */
  broadcast(query: string) {
    this._eventBus.next({ query });
  }

  onChange(): Observable<string> {
    return this._eventBus.asObservable()
      .map(event => event.query);
  }

}
