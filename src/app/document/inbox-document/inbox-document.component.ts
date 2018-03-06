import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import { UBLDocument, UBLDocumentService } from './../../ngx/ngx-clarksnut';
import { DocumentQuery } from './../../models/document-quey';
import { SearchEventService } from '../../shared/search-event.service';
import { SearchEvent } from './../../models/search-event';

import { cloneDeep } from 'lodash';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'cn-inbox-document',
  templateUrl: './inbox-document.component.html',
  styleUrls: ['./inbox-document.component.scss']
})
export class InboxDocumentComponent implements OnInit, OnDestroy {

  @HostBinding('class') classList = 'services-items-filter';

  documents: UBLDocument[] = [];
  currentNumberOfItems: number;
  totalNumberOfItems: number;

  emptyStateConfig: EmptyStateConfig;

  // Search
  private searchEvent: SearchEvent;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchEventService: SearchEventService,
    private documentService: UBLDocumentService) {
    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((event) => {
        this.searchEvent = event;
        if (!event) {
          this.searchEvent = {} as SearchEvent;
        }
        this.search();
      })
    );
  }

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'Los filtros activos posiblemente esten escondiendo algunos resultados.',
      title: 'No hay resultados que mostrar.'
    } as EmptyStateConfig;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  search() {
    // if (!this.queryBuilder) {
    //   this.queryBuilder = DocumentQuery.builder();
    // }

    // this.queryBuilder.filterText(this.searchEvent.keyword);
    // this.queryBuilder.spaces(this.searchEvent.spaces ? this.searchEvent.spaces.map((s) => s.id) : []);

    // this.queryBuilder.offset(this.searchEvent.offset || 0);
    // this.queryBuilder.limit(this.searchEvent.limit || 10);

    // this.documentService.searchDocuments('me', this.queryBuilder.build()).subscribe((searchResult) => {
    //   this.documents = searchResult.data;
    //   this.currentNumberOfItems = searchResult.data.length;
    //   this.totalNumberOfItems = searchResult.totalResults;
    // });
  }

  downloadXml(document: UBLDocument) {
    this.documentService.downloadDocumentById('me', document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${document.attributes.assignedId}.xml`);
    });
  }

  downloadPdf(document: UBLDocument) {
    this.documentService.printDocumentById('me', document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${document.attributes.assignedId}.pdf`);
    });
  }

  edit(document: UBLDocument) {
    this.router.navigate([document.id], { relativeTo: this.activatedRoute });
  }

  checkDocument(document: UBLDocument, index: number) {
    const copyDocument = cloneDeep(document);
    copyDocument.attributes.checked = true;
    this.updateDocument(copyDocument, index);
  }

  uncheckDocument(document: UBLDocument, index: number) {
    const copyDocument = cloneDeep(document);
    copyDocument.attributes.checked = false;
    this.updateDocument(copyDocument, index);
  }

  changeStar(document: UBLDocument, index: number) {
    const copyDocument = cloneDeep(document);
    copyDocument.attributes.starred = !copyDocument.attributes.starred;
    this.updateDocument(copyDocument, index);
  }

  private updateDocument(document: UBLDocument, index: number) {
    this.documentService.update('me', document).subscribe((val) => {
      this.documents[index] = val;
    });
  }

}
