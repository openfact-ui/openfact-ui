import { UBLDocumentService } from '../../ngx-clarksnut';
import { UBLDocument } from '../../ngx-clarksnut';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
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
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  filterText: string;

  private offset: number = 0;
  private limit: number = 10;

  private queryBuilder: DocumentQueryBuilder = DocumentQuery.builder();

  constructor(private documentService: UBLDocumentService) { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

  // Actions
  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13) {
      this.search();
    }
  }

  search(): void {
    this.queryBuilder
      .filterText(this.filterText)
      .offset(this.offset)
      .limit(this.limit);
  }

  // Actions

}
