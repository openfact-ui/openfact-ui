import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Broadcaster } from '../../ngx/ngx-base';
import { User, UserService } from '../../ngx/ngx-login-client';
import { Space, SpaceService } from './../../ngx/ngx-clarksnut';

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

  @Output() onChange: EventEmitter<string> = new EventEmitter();

  private _keyword: string;

  user: User;
  spaces: Space[];

  appliedFilters: Map<string, Filter> = new Map<string, Filter>();

  private subscriptions: Subscription[] = [];

  constructor(
    private broadcaster: Broadcaster,
    private userService: UserService,
    private spaceService: SpaceService,
  ) {
    this.subscriptions.push(
      Observable.merge(
        this.userService.loggedInUser.do((user) => this.user = user),
        this.broadcaster.on('spaceCreated'),
        this.broadcaster.on('spaceDeleted')
      ).subscribe((val) => {
        this.spaceService.getSpacesByUser(this.user.attributes.username, 5).subscribe((val) => {
          this.spaces = val;
        });
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  clearFilter() {

  }

  toArray(value: any) {
    return Array.from(value);
  }

  get keyword() {
    return this._keyword;
  };

  @Input()
  set keyword(value: string) {
    this._keyword = value;
    this.appliedFilters.delete('keyword');
    if (this._keyword) {
      this.appliedFilters.set('keyword', {
        name: this._keyword,
        value: this._keyword
      });
    }
  }

}
