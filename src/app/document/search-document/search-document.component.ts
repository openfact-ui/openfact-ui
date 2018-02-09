import { OnInit, Component, Input, Inject, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
import { SearchEventService } from './../../shared/search-event.service';

@Component({
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  filterText: string;

  private subscriptions: Subscription[] = [];

  constructor(private searchEventService: SearchEventService) {
    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((event) => {
        if (event) {
          this.filterText = event.keyword;
        }
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13) {
      this.searchEventService.emitEvent({
        keyword: this.filterText
      });
    }
  }

}
