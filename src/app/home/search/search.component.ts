import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  ListEvent,
  ListConfig,
  Action,
  ActionConfig,
  EmptyStateConfig,
} from 'patternfly-ng';

@Component({
  selector: 'ofs-search',
  templateUrl: 'search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy, OnInit {

  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;

  items: any[] = [];

  constructor(private router: Router) {
  }

  public ngOnInit() {
    this.emptyStateConfig = {
      iconStyleClass: 'pficon-info',
      title: 'No documents to show'
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: true,
      useExpandItems: false
    } as ListConfig;
  }

  public ngOnDestroy(): void {

  }



  // Actions
  handleAction($event: Action, item: any): void {
    console.log($event);
  }

  handleClick($event: ListEvent): void {
    //console.log($event);
  }

  handleDblClick($event: ListEvent): void {
    //console.log($event);
  }

  handleSelectionChange($event: ListEvent): void {
    //console.log($event);
  }

  onQueryChange($event: string) {
    //console.log($event);
  }

  /**
   * Get the ActionConfig properties for each row
   *
   * @param item The current row item
   * @param actionButtonTemplate {TemplateRef} Custom button template
   * @param startButtonTemplate {TemplateRef} Custom button template
   * @returns {ActionConfig}
   */
  getActionConfig(item: any, actionButtonTemplate: TemplateRef<any>, startButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [{
        id: 'start',
        styleClass: 'btn-primary',
        title: 'Start',
        tooltip: 'Start the server',
        template: startButtonTemplate
      }, {
        id: 'action1',
        title: 'Action 1',
        tooltip: 'Perform an action'
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
