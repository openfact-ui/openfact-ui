import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'cn-context-selector',
  templateUrl: './context-selector.component.html',
  styleUrls: ['./context-selector.component.scss']
})
export class ContextSelectorComponent implements OnInit, OnDestroy {

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
