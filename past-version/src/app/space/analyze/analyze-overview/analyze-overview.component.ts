import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { Context, Contexts, Space } from 'ngo-openfact-sync';

import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  private _context: Context;
  private contextSubscription: Subscription;
  private space: Space;

  isExperimentalBarActive: boolean = true;

  constructor(private contexts: Contexts) {

  }

  public ngOnInit() {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
      this.space = val.space;
    });
  }

  public ngOnDestroy() {
    this.contextSubscription.unsubscribe();
  }

}
