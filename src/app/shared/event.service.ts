import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Space } from 'ngo-openfact-sync';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class EventService {

  public deleteSpaceSubject = new BehaviorSubject<Space>({} as Space); // By default the list mode is true
  constructor() {}

}
