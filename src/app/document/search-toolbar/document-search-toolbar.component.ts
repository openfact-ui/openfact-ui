import { RoleFilterEvent } from './role-filter/role-filter-event';
import { RoleFilterConfig } from './role-filter/role-filter-config';
import { DocumentSearchToolbarInfo } from './document-search-toolbar-info';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
import { DateFilterEvent } from './date-filter/date-filter-event';
import { DateFilterConfig } from './date-filter/date-filter-config';
import { DateFilterValue } from './date-filter/date-filter-value';
import { NumberFilterEvent } from './number-filter/number-filter-event';
import { NumberFilterConfig } from './number-filter/number-filter-config';
import { NumberFilterValue } from './number-filter/number-filter-value';
import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';

import {
  SortConfig,
  SortField,
  SortEvent
} from 'patternfly-ng';

@Component({
  selector: 'ofs-document-search-toolbar',
  templateUrl: './document-search-toolbar.component.html',
  styleUrls: ['./document-search-toolbar.component.scss'],
})
export class DocumentSearchToolbarComponent implements OnInit, OnDestroy {

  /**
   * Data
   */
  @Input() data: DocumentSearchToolbarInfo;

  /**
   * Query
   */
  @Output() query: EventEmitter<string> = new EventEmitter<string>();

  filterText: string;
  roleConfig: RoleFilterConfig;

  sortConfig: SortConfig;
  isAscendingSort: boolean = true;

  dateFilterConfig: DateFilterConfig;
  amountFilterConfig: NumberFilterConfig;

  private queryBuilder: DocumentQueryBuilder = DocumentQuery.builder();

  constructor() { }

  public ngOnInit() {
    this.sortConfig = {
      fields: [{
        id: 'customerName',
        title: 'Customer Name',
        sortType: 'alpha'
      }, {
        id: 'supplierName',
        title: 'Supplier Name',
        sortType: 'alpha'
      }, {
        id: 'issueDate',
        title: 'Issue Date',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.roleConfig = {
      fields: [{
        id: 'all',
        title: 'All'
      }, {
        id: 'sender',
        title: 'Sended',
        value: 'sender'
      }, {
        id: 'receiver',
        title: 'Received',
        value: 'receiver'
      }]
    } as RoleFilterConfig;

    this.dateFilterConfig = {
      fields: [{
        id: 'anyTime',
        title: 'Any time',
        value: () => {
          return {} as DateFilterValue;
        }
      }, {
        id: 'pastHour',
        title: 'Past hour',
        value: () => {
          let after = new Date();
          after.setHours(after.getHours() - 1);
          return {
            after: after
          } as DateFilterValue;
        }
      }, {
        id: 'past24Hours',
        title: 'Past 24 hours',
        value: () => {
          let after = new Date();
          after.setHours(after.getHours() - 24);
          return {
            after: after
          } as DateFilterValue;
        }
      }, {
        id: 'pastWeek',
        title: 'Past week',
        value: () => {
          let after = new Date();
          after.setDate(after.getDate() - 7);
          return {
            after: after
          } as DateFilterValue;
        }
      }, {
        id: 'pastMonth',
        title: 'Past month',
        value: () => {
          let after = new Date();
          after.setMonth(after.getMonth() - 1);
          return {
            after: after
          } as DateFilterValue;
        }
      }, {
        id: 'pastYear',
        title: 'Past year',
        value: () => {
          let after = new Date();
          after.setMonth(after.getMonth() - 12);
          return {
            after: after
          } as DateFilterValue;
        }
      }]
    } as DateFilterConfig;

    this.amountFilterConfig = {
      fields: [{
        id: 'anyAmount',
        title: 'Any amount',
        value: {}
      }, {
        id: 'greatherThan100',
        title: 'Greater than 100',
        value: {
          min: 100
        }
      }, {
        id: 'greatherThan1000',
        title: 'Greater than 1,000',
        value: {
          min: 1000
        }
      }, {
        id: 'greatherThan10000',
        title: 'Greater than 10,000',
        value: {
          min: 10000
        }
      }, {
        id: 'greatherThan100000',
        title: 'Greater than 100,000',
        value: {
          min: 100000
        }
      }, {
        id: 'greatherThan1000000',
        title: 'Greater than 1,000,000',
        value: {
          min: 1000000
        }
      }]
    } as NumberFilterConfig;
  }

  public ngOnDestroy(): void {

  }

  sortChange($event: SortEvent): void {
    console.log($event);
  }

  roleChange($event: RoleFilterEvent): void {
    let role: string = $event.field.value;
    this.queryBuilder.role(role);
    this.search();
  }

  dateFilterChange($event: DateFilterEvent): void {
    let range: DateFilterValue = $event.field.value();
    this.queryBuilder.after(range.after);
    this.queryBuilder.before(range.before);
    this.search();
  }

  amountFilterChange($event: NumberFilterEvent): void {
    let range: NumberFilterValue = $event.field.value;
    this.queryBuilder.greaterThan(range.min);
    this.queryBuilder.lessThan(range.max);
    this.search();
  }

  // Actions
  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13) {
      this.search();
    }
  }

  search(): void {
    let q = this.queryBuilder.filterText(this.filterText)
      .build()
      .query();
    this.query.emit(q);
  }

}
