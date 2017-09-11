import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { IWorkflow } from './models/workflow';
import { IModalHost } from '../../wizard/models/modal-host';
import { SpaceWizardComponent } from '../../wizard/space-wizard.component';
import { Context, Contexts } from 'ngo-openfact-sync';

import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'ofs-analyzeOverview',
  templateUrl: 'analyze-overview.component.html',
  styleUrls: ['./analyze-overview.component.scss']
})
export class AnalyzeOverviewComponent implements OnInit, OnDestroy {

  constructor(
  ) {

  }
  ngOnInit() {

  }

  ngOnDestroy() {

  }

}
