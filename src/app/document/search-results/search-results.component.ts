import { Router, ActivatedRoute } from '@angular/router';
import { UBLDocument, UBLDocumentService } from '../../ngx-clarksnut';
import { Component, OnDestroy, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListEvent, ListConfig, } from 'patternfly-ng/list';
import { Action, ActionConfig } from 'patternfly-ng/action';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'ofs-search-results',
  templateUrl: 'search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnDestroy, OnInit {

  @Input() items: UBLDocument[] = [];
  @Output() onSelectionChange: EventEmitter<UBLDocument[]> = new EventEmitter<UBLDocument[]>();

  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;

  private selectedItems: UBLDocument[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private documentService: UBLDocumentService) {
  }

  ngOnInit() {
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
  }

  ngOnDestroy() {

  }

  // Actions
  handleAction($event: Action, item: any): void {
    if ($event.id === 'edit') {
      this.router.navigate(['/_inbox', item.id]);
    } else if ($event.id === 'print') {
      this.documentService.printDocumentById(item.id).subscribe(val => {
        FileSaver.saveAs(val.file, val.filename || `${item.attributes.assignedId}.pdf`);
      });
    } else if ($event.id === 'download') {
      this.documentService.downloadDocumentById(item.id).subscribe(val => {
        FileSaver.saveAs(val.file, val.filename || `${item.attributes.assignedId}.xml`);
      });
    }
  }

  handleClick($event: ListEvent): void {
    //this.router.navigate(['/_inbox', $event.item.id]);
  }

  handleSelectionChange($event: ListEvent): void {
    this.selectedItems.push($event.item);
    this.onSelectionChange.emit(this.selectedItems);
  }

  /**
   * Get the ActionConfig properties for each row
   *
   * @param item The current row item
   * @param printButtonTemplate {TemplateRef} Custom button template
   * @returns {ActionConfig}
   */
  getActionConfig(item: any, printButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [{
        id: 'print',
        title: 'Print',
        tooltip: 'Print',
        template: printButtonTemplate
      }, {
        id: 'edit',
        title: 'Edit',
        tooltip: 'Edit'
      }],
      moreActions: [{
        id: 'download',
        title: 'Download',
        tooltip: 'Download'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;

    return actionConfig;
  }

  markAsStarred(item: UBLDocument) {
    item.attributes.starred = !item.attributes.starred;
    this.documentService.update(item).subscribe(val => {
      console.log('Document updated');
    });
  }

}
