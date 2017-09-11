import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  TemplateRef
} from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { SpaceWizardComponent } from '../../wizard/space-wizard.component';
import { Context, Contexts } from 'ngo-openfact-sync';

import { Subscription } from 'rxjs';

import { Action, ActionConfig, EmptyStateConfig, ListEvent, ListConfig } from 'patternfly-ng';

import { cloneDeep } from 'lodash';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  actionsText: string = '';
  allItems: any[];
  emptyStateConfig: EmptyStateConfig;
  items: any[];
  itemsAvailable: boolean = true;
  public listConfig: ListConfig;
  selectType: string = 'checkbox';

  constructor(private contexts: Contexts) {

  }

  public ngOnInit() {
    this.allItems = [{
      name: 'Fred Flintstone',
      address: '20 Dinosaur Way',
      city: 'Bedrock',
      state: 'Washingstone',
      typeIcon: 'fa-plane',
      clusterCount: 6,
      hostCount: 8,
      imageCount: 8,
      nodeCount: 10
    }, {
      name: 'John Smith',
      address: '415 East Main Street',
      city: 'Norfolk',
      state: 'Virginia',
      typeIcon: 'fa-magic',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8,
      hideExpandToggle: true
    }, {
      name: 'Frank Livingston',
      address: '234 Elm Street',
      city: 'Pittsburgh',
      state: 'Pennsylvania',
      typeIcon: 'fa-gamepad',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }, {
      name: 'Linda McGovern',
      address: '22 Oak Street',
      city: 'Denver',
      state: 'Colorado',
      typeIcon: 'fa-linux',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }, {
      name: 'Jim Brown',
      address: '72 Bourbon Way',
      city: 'Nashville',
      state: 'Tennessee',
      typeIcon: 'fa-briefcase',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }, {
      name: 'Holly Nichols',
      address: '21 Jump Street',
      city: 'Hollywood',
      state: 'California',
      typeIcon: 'fa-coffee',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }, {
      name: 'Marie Edwards',
      address: '17 Cross Street',
      city: 'Boston',
      state: 'Massachusetts',
      typeIcon: 'fa-rebel',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }, {
      name: 'Pat Thomas',
      address: '50 Second Street',
      city: 'New York',
      state: 'New York',
      typeIcon: 'fa-linux',
      hostCount: 8,
      clusterCount: 6,
      nodeCount: 10,
      imageCount: 8
    }];
    // this.allItems = [];
    this.items = cloneDeep(this.allItems);

    this.emptyStateConfig = {
      actions: {
        primaryActions: [],
        moreActions: []
      } as ActionConfig,
      iconStyleClass: 'pficon-info',
      title: 'No Items Available',
      info: 'No documents were found on your current space.'
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

  public ngOnDestroy() {

  }

  public openForgeWizard() {
    // this.updateSpace.open(this.spaceWizard.steps.spaceConfigurator);
  }

  /**
   * Get the ActionConfig properties for each row
   * @param item The current row item
   * @param actionButtonTemplate {TemplateRef} Custom button template
   * @param startButtonTemplate {TemplateRef} Custom button template
   * @returns {ActionConfig}
   */
  public getActionConfig(item: any, actionButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [{
        id: 'edit',
        title: 'Edit',
        tooltip: 'Edit document',
        template: actionButtonTemplate,
      }],
      moreActions: [{
        id: 'pdf',
        title: 'Pdf',
        tooltip: 'Pdf document'
      }, {
        id: 'xml',
        title: 'Xml',
        tooltip: 'Xml document'
      }, {
        id: 'moreActions',
        title: '',
        separator: true
      }, {
        id: 'forward',
        title: 'Forward',
        tooltip: 'Forward by email'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;

    return actionConfig;
  }

  // Actions

  public handleAction($event: Action, item: any): void {
    console.log('handling action event:', event, ' item:', item);
  }

  public handleSelectionChange($event: ListEvent): void {
    console.log('handling selection event:', event);
  }

  public handleClick($event: ListEvent): void {
    console.log('handling click event:', event);
  }

  public handleDblClick($event: ListEvent): void {
    console.log('handling double click event:', event);
  }

}
