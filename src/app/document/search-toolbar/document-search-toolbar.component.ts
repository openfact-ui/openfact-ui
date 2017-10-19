import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'ofs-document-search-toolbar',
  templateUrl: './document-search-toolbar.component.html',
  styleUrls: ['./document-search-toolbar.component.scss'],
})
export class DocumentSearchToolbarComponent implements OnInit, OnDestroy {

  @Output()
  query: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  public ngOnInit() {
    setTimeout(() => {
      this.query.emit("{ 'query': { 'match' : { 'type' : 'invoice' } } }");
    }, 1500)
  }

  public ngOnDestroy(): void {

  }

}
