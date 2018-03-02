import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Broadcaster } from '../../../ngx/ngx-base';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { Space, SpaceService } from './../../../ngx/ngx-clarksnut';
import { SearchEventService } from '../../../shared/search-event.service';

export class Filter {
  name: string;
  value: any;
}

@Component({
  selector: 'cn-filter-document',
  templateUrl: './filter-document.component.html',
  styleUrls: ['./filter-document.component.scss']
})
export class FilterDocumentComponent implements OnInit, OnDestroy {

  @Input() currentNumberOfItems: number;
  @Input() totalNumberOfItems: number;

  keyword: string;
  offset = 0;
  limit = 10;

  user: User;
  spaces: Space[];

  appliedFilters: Map<string, Filter> = new Map<string, Filter>();

  private subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService,
    private searchEventService: SearchEventService,
  ) {
    this.subscriptions.push(
      Observable.merge(
        this.userService.loggedInUser.do((user) => this.user = user),
        this.broadcaster.on('spaceCreated'),
        this.broadcaster.on('spaceDeleted')
      ).subscribe((val) => {
        this.spaceService.getSpacesByUserId(this.user.id, 'owner', 5).subscribe((val) => {
          this.spaces = val;
        });
      })
    );

    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((event) => {
        this.appliedFilters.delete('keyword');
        if (event && event.keyword) {
          this.appliedFilters.set('keyword', {
            name: event.keyword,
            value: event.keyword
          });
        }
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  toArray(value: any) {
    return Array.from(value);
  }

  clearFilter(filter: string) {
    this.appliedFilters.delete(filter);
  }

  clearAllFilters() {
    this.appliedFilters.clear();

    const current = this.searchEventService.current || {};
    this.searchEventService.emitEvent(Object.assign(current, {
      keyword: null,
      offset: 0,
      limit: this.limit
    }));
  }

  previousPage() {
    this.offset = this.offset - this.limit;
    if (this.offset < 0) {
      this.offset = 0;
    }
    this.search();
  }

  nextPage() {
    const factor = this.offset === 0 ? 1 : 0;
    this.offset = this.offset + this.limit - factor;
    this.search();
  }

  search() {
    const current = this.searchEventService.current || {};
    this.searchEventService.emitEvent(Object.assign(current, {
      offset: this.offset,
      limit: this.limit,
      spaces: this.selectedSpaces
    }));
  }

  get selectedSpaces() { // right now: ['1','3']
    return this.spaces
      .filter(space => (<any>space).checked)
      .map(opt => opt.id);
  }

  checkedSpacesChanged() {
    this.search();
  }
}
