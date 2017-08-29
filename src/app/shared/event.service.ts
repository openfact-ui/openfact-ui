import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Space } from 'ngo-openfact-sync';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class EventService {

    // By default the list mode is true
    public deleteSpaceSubject = new BehaviorSubject<Space>({} as Space);

    constructor() { }

}
