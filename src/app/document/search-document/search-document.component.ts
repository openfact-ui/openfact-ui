import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';

@Component({
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  @Output() onKeywordChange: EventEmitter<string> = new EventEmitter<string>();

  filterText: string;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13) {
      this.onKeywordChange.emit(this.filterText);
    }
  }

}
