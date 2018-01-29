import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'cn-document-filter',
  templateUrl: './document-filter.component.html',
  styleUrls: ['./document-filter.component.scss'],
})
export class DocumentFilterComponent implements OnInit, OnDestroy {


  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
