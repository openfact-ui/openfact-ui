import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import { UBLDocument, UBLDocumentService, DocumentQuery, DocumentQueryAttributes, SearchResult } from './../../ngx/ngx-clarksnut';
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
  searchResult: SearchResult<UBLDocument>;

  emptyStateConfig: EmptyStateConfig;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchEventService: SearchEventService,
    private documentService: UBLDocumentService) {
    this.subscriptions.push(
      this.searchEventService.value.subscribe((event) => {
        this.search(event);
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

  search(event: SearchEvent) {
    const query = this.createTransientQuery();
    query.attributes.filterText = event.keyword;
    query.attributes.spaces = event.spaces ? event.spaces.map((s) => s.id) : [];
    query.attributes.offset = event.offset || 0;
    query.attributes.limit = event.limit || 10;

    query.attributes.starred = event.star;
    query.attributes.viewed = event.view;
    query.attributes.checked = event.check;

    this.documentService.searchDocuments('me', query).subscribe((searchResult) => {
      this.searchResult = searchResult;
      this.documents = searchResult.data;
    });
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

  private createTransientQuery() {
    return {
      type: 'documentQuery',
      attributes: new DocumentQueryAttributes()
    } as DocumentQuery;
  }
}
