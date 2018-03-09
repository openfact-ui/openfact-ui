import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Broadcaster } from '../../../ngx/ngx-base';
import { User, UserService } from '../../../ngx/ngx-login-client';
import { Space, SpaceService, SearchResult, UBLDocument } from './../../../ngx/ngx-clarksnut';
import { SearchEventService } from '../../../shared/search-event.service';
import { SearchEvent } from './../../../models/search-event';

export interface Filter {
  name: string;
  type: FilterType;
  value: string | string[] | RangeValue | [RangeValue];
}

export interface RangeValue {
  from: number | Date;
  to: number | Date;
}

export enum FilterType {
  STRING,
  STRING_ARRAY,
  NUMERIC_RANGE,
  DASTE_RANGE
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

  filters: Filter[] = [];
  offset = 0;
  limit = 10;

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
        this.initFilters(event);
      })
    );
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }


  /**
   * Pagination
  */

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

  /**
   * Services
  */

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

  /**
   * Filters
   */

  initFilters(event: SearchEvent) {
    this.filters = [];
    if (event.keyword) {
      this.filters.push({ name: 'keyword', type: FilterType.STRING, value: event.keyword } as Filter);
    }
    if (event.spaces) {
      this.filters.push({ name: 'spaces', type: FilterType.STRING_ARRAY, value: (event.spaces || []).map(s => s.attributes.name) } as Filter);
    }
    if (event.type) {
      this.filters.push({ name: 'type', type: FilterType.STRING_ARRAY, value: event.type } as Filter);
    }
    if (event.currency) {
      this.filters.push({ name: 'currency', type: FilterType.STRING_ARRAY, value: event.currency } as Filter);
    }
    if (event.fromAmount || event.toAmount) {
      this.filters.push({ name: 'amount', type: FilterType.NUMERIC_RANGE, value: { from: event.fromAmount, to: event.toAmount } } as Filter);
    }
    if (event.fromIssueDate || event.toIssueDate) {
      this.filters.push({ name: 'issueDate', type: FilterType.DASTE_RANGE, value: { from: event.fromIssueDate, to: event.toIssueDate } } as Filter);
    }
  }

  clearFilter(filter: any) {
    console.log(filter);
    // this.appliedFilters.delete(filter);
  }

  clearAllFilters() {
    this.filters = [];

    const searchEvent = new SearchEvent();
    searchEvent.keyword = null;
    searchEvent.type = null;
    searchEvent.currency = null;

    searchEvent.spaces = null;

    searchEvent.fromAmount = null;
    searchEvent.toAmount = null;

    searchEvent.fromIssueDate = null;
    searchEvent.toIssueDate = null;

    this.searchEventService.patch(searchEvent);
  }

  applyTypeFilter(type: string) {
    const searchEvent: SearchEvent = this.searchEventService.getCurrentValue();

    const newSearhEvent = new SearchEvent();
    newSearhEvent.type = searchEvent.type || [];
    newSearhEvent.type.push(type);

    this.searchEventService.patch(newSearhEvent);
  }

  applyCurrencyFilter(currency: string) {
    const searchEvent: SearchEvent = this.searchEventService.getCurrentValue();

    const newSearhEvent = new SearchEvent();
    newSearhEvent.currency = searchEvent.currency || [];
    newSearhEvent.currency.push(currency);

    this.searchEventService.patch(newSearhEvent);
  }

  applyAmountFilter(from: number, to: number) {
    const newSearhEvent = new SearchEvent();
    newSearhEvent.fromAmount = from;
    newSearhEvent.toAmount = to;

    this.searchEventService.patch(newSearhEvent);
  }

  applyIssueDateFilter(from: number, to: number) {
    const newSearhEvent = new SearchEvent();
    newSearhEvent.fromIssueDate = from ? new Date(from) : null;
    newSearhEvent.toIssueDate = to ? new Date(to) : null;

    this.searchEventService.patch(newSearhEvent);
  }

}
