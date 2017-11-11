import { DocumentSearchToolbarInfo } from './../search-toolbar/document-search-toolbar-info';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UBLDocumentService, UBLDocument, Space } from 'ngo-openfact-sync';

import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';

import {
  ListEvent,
  ListConfig,
  Action,
  ActionConfig,
  EmptyStateConfig,
} from 'patternfly-ng';

@Component({
  selector: 'ofs-starred',
  templateUrl: 'starred.component.html',
  styleUrls: ['./starred.component.scss']
})
export class StarredComponent implements OnDestroy, OnInit {

  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;

  //
  items: any[] = [];

  //
  totalResults: number = 0;
  documentsSelected: UBLDocument[] = [];

  private selectedSpace: Space;
  private queryBuilder: DocumentQueryBuilder;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: UBLDocumentService) {
  }

  public ngOnInit() {
    this.emptyStateConfig = {
      iconStyleClass: 'pficon-info',
      title: 'No documents to show'
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: true,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: true,
      useExpandItems: false
    } as ListConfig;

    this.search();
  }

  public ngOnDestroy(): void {

  }

  // Actions
  handleAction($event: Action, item: any): void {
    if ($event.id === 'edit') {
      this.router.navigate([item.id], { relativeTo: this.route });
    }
  }

  handleClick($event: ListEvent): void {
    this.router.navigate(['/_starred', $event.item.id], /*{ relativeTo: this.route }*/);
  }

  handleSelectionChange($event: ListEvent): void {
    this.documentsSelected = $event.selectedItems;
  }

  //  Toolbar actions
  onToolbarChange($event: DocumentQueryBuilder) {
    this.queryBuilder = $event;
    this.search();
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

  /**
   * Get the ActionConfig properties for each row
   *
   * @param item The current row item
   * @param printButtonTemplate {TemplateRef} Custom button template
   * @param downloadButtonTemplate {TemplateRef} Custom button template
   * @returns {ActionConfig}
   */
  getActionConfig(item: any, printButtonTemplate: TemplateRef<any>, downloadButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [{
        id: 'print',
        title: 'Print',
        tooltip: 'Print',
        template: printButtonTemplate
      }, {
        id: 'download',
        title: 'Download',
        tooltip: 'Download',
        template: downloadButtonTemplate
      }, {
        id: 'edit',
        title: 'Edit',
        tooltip: 'Edit'
      }],
      moreActions: [{
        id: 'moreActions1',
        title: 'Action',
        tooltip: 'Perform an action'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;

    return actionConfig;
  }

}
