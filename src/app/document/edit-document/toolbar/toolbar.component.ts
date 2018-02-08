import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { UBLDocumentService, UBLDocument, Context } from '../../../ngx/ngx-clarksnut';
import { ContextService } from './../../../ngx-impl/ngx-clarksnut-impl/context.service';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'cn-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  private context: Context;
  private subscriptions: Subscription[] = [];

  constructor(
    private location: Location,
    private contexts: ContextService,
    private documentService: UBLDocumentService
  ) {
    this.subscriptions.push(
      this.contexts.current.subscribe(val => {
        this.context = val;
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

  back() {
    this.location.back();
  }

  downloadXml() {
    this.documentService.downloadDocumentById(this.document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${this.document.attributes.assignedId}.xml`);
    });
  }

  downloadPdf() {
    this.documentService.printDocumentById(this.document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${this.document.attributes.assignedId}.pdf`);
    });
  }

}
