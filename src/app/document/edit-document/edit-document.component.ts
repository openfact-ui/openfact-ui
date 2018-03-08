import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SearchEventService } from '../../shared/search-event.service';
import { Context, UBLDocument, UBLDocumentService } from '../../ngx/ngx-clarksnut';
import { ContextService } from './../../ngx-impl/ngx-clarksnut-impl/context.service';

@Component({
  selector: 'cn-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})
export class EditDocumentComponent implements OnInit, OnDestroy {

  private context: Context;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private searchEventService: SearchEventService,
    private contexts: ContextService,
    private documentService: UBLDocumentService
  ) {
    this.subscriptions.push(
      this.searchEventService.value.skip(1).subscribe((event) => {
        this.router.navigate(['_home']);
      })
    );

    this.subscriptions.push(
      this.contexts.current.subscribe(val => {
        this.context = val;
        this.updateDocument();
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  get document(): UBLDocument {
    return this.context.document;
  }

  private updateDocument() {
    const documentToUpdate: UBLDocument = this.document;
    documentToUpdate.attributes.viewed = true;

    this.documentService.update('me', documentToUpdate).subscribe((val) => {
      this.context.document = val;
    });
  }

}
