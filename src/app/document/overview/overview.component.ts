import { ContextService } from './../../shared/context.service';
import { Context, UBLDocumentService, UBLDocument } from 'ngo-openfact-sync';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-overview',
  templateUrl: 'overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnDestroy, OnInit {

  private context: Context;
  private contextSubscription: Subscription;

  starred: boolean;
  _tags: string[] = [];

  constructor(
    private contexts: ContextService,
    private documentService: UBLDocumentService) {
    this.contextSubscription = this.contexts.current.subscribe(val => {
      this.context = val;
    });
  }

  ngOnInit() {
    this.starred = this.context.document.attributes.starred;
    this.tags = this.context.document.attributes.tags;
  }

  ngOnDestroy(): void {
    this.contextSubscription.unsubscribe();
  }

  get document(): UBLDocument {
    return this.context.document;
  }

  get tags() {
    return this._tags;
  }

  set tags(tags: string[]) {
    this._tags = tags;

    let document = this.buildTransitiveDocument();
    document.attributes.tags = tags;
    this.documentService.update(document).subscribe(val => {

    });
  }

  onStarChange() {
    this.starred = !this.starred;

    let document = this.buildTransitiveDocument();
    document.attributes.starred = this.starred;
    this.documentService.update(document).subscribe(val => {

    });
  }

  private buildTransitiveDocument(): UBLDocument {
    let document = this.context.document;
    return {
      id: document.id,
      attributes: {
        id: document.id
      }
    } as UBLDocument;
  }

}
