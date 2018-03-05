import { Router } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SearchEvent } from './../models/search-event';

@Injectable()
export class SearchEventService {

  private _eventListener: BehaviorSubject<SearchEvent> = new BehaviorSubject(null);

  constructor() {

  }

  get current(): SearchEvent {
    return this._eventListener.getValue();
  }

  get eventListener(): Observable<SearchEvent> {
    return this._eventListener;
  }

  emitEvent(event: SearchEvent) {
    this._eventListener.next(event);
  }

}
