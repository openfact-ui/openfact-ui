import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { UBLDocumentService, UBLDocument, Space } from 'ngo-openfact-sync';

import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';

@Component({
  selector: 'ofs-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy, OnInit {

  items: any[] = [];

  //
  totalResults: number = 0;
  documentsSelected: UBLDocument[] = [];

  private selectedSpace: Space;
  private queryBuilder: DocumentQueryBuilder;

  constructor(private documentService: UBLDocumentService) {
  }

  ngOnInit() {
    this.search();
  }

  ngOnDestroy() {

  }

  //  Toolbar actions
  onToolbarChange($event: DocumentQueryBuilder) {
    this.queryBuilder = $event;
    this.search();
  }

  // Search results actions
  handleSelectionChange($event: UBLDocument[]): void {
    this.documentsSelected = $event;
  }

  // Search
  search() {
    if (!this.queryBuilder) {
      this.queryBuilder = DocumentQuery.builder();
    }
    if (this.selectedSpace) {
      this.queryBuilder.spaces([this.selectedSpace.attributes.assignedId]);
    } else {
      this.queryBuilder.spaces([]);
    }
    this.queryBuilder.starred(true);

    this.documentService.search(this.queryBuilder.build().query()).subscribe((searchResult) => {
      this.items = searchResult.data;
      this.totalResults = searchResult.totalResults;
    });
  }

}
