import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { Context, Contexts } from 'ngo-openfact-sync';

import {Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('updateSpace') updateSpace: IModalHost;
  private _context: Context;
  private contextSubscription: Subscription;

  constructor(
    private contexts: Contexts
  ) {

  }

  public ngOnInit() {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
    });
  }

  public ngOnDestroy() {
    this.contextSubscription.unsubscribe();
  }

  public openForgeWizard() {

  }

}
