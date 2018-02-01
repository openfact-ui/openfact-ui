import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'

import { Subscription } from 'rxjs/Subscription';

import { UploaderOptions } from 'ngx-uploader';
import { ListConfig } from 'patternfly-ng/list/list.module';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import { Space, Spaces, SpaceService, Context, Contexts } from '../ngx/ngx-clarksnut';
import { UBLDocument, UBLDocumentService } from '../ngx/ngx-clarksnut';
import { UserService, User } from '../ngx/ngx-login-client';
import { Logger } from '../ngx/ngx-base';

import { DocumentQuery, DocumentQueryBuilder } from './../models/document-quey';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  listConfig: ListConfig;
  emptyStateConfig: EmptyStateConfig;

  documents: UBLDocument[] = [];

  // Search
  searchKeyword: string;

  // Query
  private queryBuilder: DocumentQueryBuilder;

  constructor(
    private documentService: UBLDocumentService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    this.renderer.removeClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
    this.emptyStateConfig = {
      iconStyleClass: 'pficon-info',
      title: 'No results match',
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
  }

  ngOnDestroy() {

  }

  onKeywordChange(keyword: string) {
    this.searchKeyword = keyword;
    this.search();
  }

  onFilterChange() {

  }

  search() {
    if (!this.queryBuilder) {
      this.queryBuilder = DocumentQuery.builder();
    }
    this.queryBuilder.filterText(this.searchKeyword);
    this.queryBuilder.spaces([]);
    this.queryBuilder.limit(10);

    this.documentService.search(this.queryBuilder.build().query()).subscribe((searchResult) => {
      this.documents = searchResult.data;
    });
  }

}
