import { Router } from '@angular/router';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SearchEvent } from './../models/search-event';

@Injectable()
export class SearchEventService {

  private _eventListener: BehaviorSubject<SearchEvent> = new BehaviorSubject(new SearchEvent());

  constructor() {

  }

  get value(): Observable<SearchEvent> {
    return this._eventListener;
  }

  patch(patchValue: SearchEvent) {
    const event = this._eventListener.getValue();
    this._eventListener.next(Object.assign(event, patchValue));
  }

  keyword(keyword: string) {
    const event = this._eventListener.getValue();
    event.keyword = keyword;
    this.patch(event);
  }

  star(start: boolean) {
    const event = this._eventListener.getValue();
    event.star = start;
    this.patch(event);
  }

}
