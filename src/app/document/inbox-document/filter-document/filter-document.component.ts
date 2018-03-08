import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Broadcaster } from '../../../ngx/ngx-base';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { Space, SpaceService, SearchResult, UBLDocument } from './../../../ngx/ngx-clarksnut';
import { SearchEventService } from '../../../shared/search-event.service';
import { SearchEvent } from './../../../models/search-event';

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

  @Input() searchResult: SearchResult<UBLDocument>;

  loggedInUser: User;
  ownedSpaces: Space[] = [];
  collaboratedSpaces: Space[] = [];

  keyword: string;
  offset = 0;
  limit = 10;

  appliedFilters: Map<string, Filter> = new Map<string, Filter>();

  private subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService,
    private searchEventService: SearchEventService,
  ) {

    this.subscriptions.push(
      userService.loggedInUser
        .do((user) => {
          this.loggedInUser = user;
          this.refreshSpaces();
        })
        .publish().connect()
    );

    this.subscriptions.push(
      Observable.merge(
        this.broadcaster.on('spaceCreated'),
        this.broadcaster.on('spaceDeleted')
      ).subscribe((val) => {
        this.refreshSpaces();
      })
    );

    this.subscriptions.push(
      this.searchEventService.value.subscribe((event) => {
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

    const current = this.searchEventService.value || {};
    this.searchEventService.patch(Object.assign(current, {
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

  refreshSpaces() {
    this.spaceService.getOwnedSpacesByUserId('me').subscribe((val) => {
      this.ownedSpaces = val;
    });
    this.spaceService.getCollaboratedSpacesByUserId('me').subscribe((val) => {
      this.collaboratedSpaces = val;
    });
  }

  search() {
    const event = new SearchEvent();
    event.spaces = this.selectedSpaces;
    event.offset = this.offset;
    event.limit = this.limit;
    this.searchEventService.patch(event);
  }

  get selectedSpaces(): Space[] {
    const owned = this.ownedSpaces.filter(space => (<any>space).checked);
    const collaborated = this.collaboratedSpaces.filter(space => (<any>space).checked);
    return owned.concat(collaborated);
  }

  checkedSpacesChanged() {
    this.offset = 0;
    this.limit = 10;
    this.search();
  }
}
