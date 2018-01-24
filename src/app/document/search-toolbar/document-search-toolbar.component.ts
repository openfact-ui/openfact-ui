import { UBLDocumentService } from '../../ngx-clarksnut';
import { UBLDocument } from '../../ngx-clarksnut';
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

import * as FileSaver from 'file-saver';
import { cloneDeep } from 'lodash';

import {
  SortConfig,
  SortField,
  SortEvent
} from 'patternfly-ng/sort';

@Component({
  selector: 'ofs-document-search-toolbar',
  templateUrl: './document-search-toolbar.component.html',
  styleUrls: ['./document-search-toolbar.component.scss'],
})
export class DocumentSearchToolbarComponent implements OnInit, OnDestroy {

  /**
   * Data
   */
  @Input() isAdvancedFilterEnabled: boolean = true;

  /**
   * Data
   */
  @Input() totalResults: number;

  /**
   * Data
   */
  @Input() selections: UBLDocument[] = [];

  /**
   * Query
   */
  @Output() onChange: EventEmitter<DocumentQueryBuilder> = new EventEmitter<DocumentQueryBuilder>();

  filterText: string;
  roleConfig: RoleFilterConfig;

  sortConfig: SortConfig;
  isAscendingSort: boolean = true;

  dateFilterConfig: DateFilterConfig;
  amountFilterConfig: NumberFilterConfig;

  showTools: boolean = true;

  private offset: number = 0;
  private limit: number = 10;

  private queryBuilder: DocumentQueryBuilder = DocumentQuery.builder();

  constructor(private documentService: UBLDocumentService) { }

  public ngOnInit() {
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

    this.sortConfig = {
      fields: [{
        id: 'issueDate',
        title: 'Issue Date',
        sortType: 'alpha'
      }, {
        id: 'amount',
        title: 'Amount',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

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

  roleChange($event: RoleFilterEvent): void {
    let role: string = $event.field.value;
    this.queryBuilder.role(role);
    this.search();
  }

  sortChange($event: SortEvent): void {
    this.queryBuilder.orderBy($event.field.id);
    this.queryBuilder.asc($event.isAscending);
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

  previousPage() {
    this.offset = this.offset - this.limit;
    if (this.offset < 0) {
      this.offset = 0;
    }
    this.search();
  }

  nextPage() {
    let factor = this.offset === 0 ? 1 : 0;
    this.offset = this.offset + this.limit - factor;
    this.search();
  }

  search(): void {
    this.queryBuilder
      .filterText(this.filterText)
      .offset(this.offset)
      .limit(this.limit);
    this.onChange.emit(this.queryBuilder);
  }

  // Actions

  download() {
    this.documentService.downloadDocumentsMassive(this.selections.map(d => d.id)).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `xmls.zip`);
    });
  }

  print() {
    this.documentService.printDocumentsMassive(this.selections.map(d => d.id)).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `reports.zip`);
    });
  }

  markAsStarred() {
    let documents = this.selections.map(document => {
      let result: UBLDocument = cloneDeep(document);
      delete result['selected'];
      result.attributes.starred = true;
      return result;
    });
    this.documentService.updateMassive(documents).subscribe(val => {
      console.log('Documents were marked as starred');
      this.search();
    });
  }

}
