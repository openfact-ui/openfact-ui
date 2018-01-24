import { DocumentQueryBuilder } from './../../models/document-quey';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { Context, UBLDocumentService, UBLDocument } from '../../ngx-clarksnut';
import { ContextService } from './../../ngx-clarksnut-impl/context.service';

import * as FileSaver from 'file-saver';

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
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
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

  onTagsChange(event?: any) {

  }

  // Search actions
  onToolbarChange($event: DocumentQueryBuilder) {
    let query = $event.build().query();
    this.router.navigate(['/_search', query]);
  }

  // Actions
  back() {
    this.location.back();
  }

  print() {
    this.documentService.printDocumentById(this.document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${this.document.attributes.assignedId}.pdf`);
    });
  }

  download() {
    this.documentService.downloadDocumentById(this.document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${this.document.attributes.assignedId}.xml`);
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
