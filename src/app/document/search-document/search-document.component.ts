import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit, Component, Input, Inject, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { Space, Party, PartyService, UBLDocumentService, UBLDocument } from './../../ngx/ngx-clarksnut';
import { SearchEvent } from './../../models/search-event';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
import { SearchEventService } from './../../shared/search-event.service';

@Component({
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  form: FormGroup;

  parties: Party[] = [];
  documents: UBLDocument[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private partyService: PartyService,
    private documentService: UBLDocumentService,
    private searchEventService: SearchEventService) {

    // Form
    this.form = this.formBuilder.group({
      filterText: [null, Validators.compose([Validators.maxLength(255)])]
    });

    // Filter Text
    this.subscriptions.push(
      this.form.get('filterText').valueChanges
        .debounceTime(100)
        .distinctUntilChanged()
        .subscribe((value) => {
          this.partyService.getParties('me', value, [], 2).subscribe((parties) => {
            this.parties = parties;
          });
          this.documentService.getDocuments('me', value, [], 4).subscribe((documents) => {
            this.documents = documents;
          });
        })
    );

    // Search events listener
    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((searchEvent) => {
        if (searchEvent) {
          this.form.patchValue({
            filterText: searchEvent.keyword
          });
        }
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13 && this.form.valid) {
      this.searchEventService.emitEvent({
        keyword: this.form.value.filterText
      } as SearchEvent);
    }
  }

  selectParty(party: Party) {
    this.searchEventService.emitEvent({
      keyword: party.attributes.name
    } as SearchEvent);
  }

  selectDocument(document: UBLDocument) {
    this.router.navigate(['/_home', document.id]);
  }

}
