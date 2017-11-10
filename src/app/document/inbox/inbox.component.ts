import { DocumentSearchToolbarInfo } from './../search-toolbar/document-search-toolbar-info';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { UBLDocumentService, Space } from 'ngo-openfact-sync';

import * as FileSaver from 'file-saver';

import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';

import {
  ListEvent,
  ListConfig,
  Action,
  ActionConfig,
  EmptyStateConfig,
} from 'patternfly-ng';

@Component({
  selector: 'ofs-inbox',
  templateUrl: 'inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnDestroy, OnInit {

  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;

  items: any[] = [];

  toolbarInfo: DocumentSearchToolbarInfo = {
    totalResults: 0,
    totalSelected: 0
  };

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
      this.router.navigate(['/_inbox', item.id]);
    } else if ($event.id === 'print') {
      this.documentService.getDocumentReportById(item.id).subscribe(val => {
        FileSaver.saveAs(val.file, val.filename || `${item.attributes.assignedId}.pdf`);
      });
    } else if ($event.id === 'download') {
      this.documentService.getDocumentXmlById(item.id).subscribe(val => {
        FileSaver.saveAs(val.file, val.filename || `${item.attributes.assignedId}.xml`);
      });
    }
  }

  handleClick($event: ListEvent): void {
    this.router.navigate(['/_inbox', $event.item.id]);
  }

  handleSelectionChange($event: ListEvent): void {
    this.toolbarInfo.totalSelected = $event.selectedItems.length;
  }

  //  Toolbar actions
  onToolbarChange($event: DocumentQueryBuilder) {
    this.queryBuilder = $event;
    this.search();
  }

  // Tab actions
  onTabChange(space: Space) {
    this.selectedSpace = space;
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
    if (!this.queryBuilder.getLimit()) {
      this.queryBuilder.limit(10);
    }

    this.documentService.search(this.queryBuilder.build().query()).subscribe((data) => {
      this.items = data;
      this.toolbarInfo.totalResults = data.length;
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
