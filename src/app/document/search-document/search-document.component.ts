import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { OnInit, Component, Input, Inject, OnDestroy, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Space, Party, PartyService, UBLDocumentService, UBLDocument } from './../../ngx/ngx-clarksnut';
import { SearchEvent } from './../../models/search-event';
import { SearchEventService } from './../../shared/search-event.service';

@Component({
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  typeaheadModel: any;
  private subscriptions: Subscription[] = [];

  formatter = (x: Party | UBLDocument) => {
    const type: string = x['type'];
    if (type === 'parties') {
      return (<Party>x).attributes.name;
    } else if (type === 'ubl-document') {
      return (<UBLDocument>x).attributes.assignedId;
    }
    return x;
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term) => {
        const partiesObs = this.partyService.getParties('me', term, [], 2).catch(() => Observable.of([]));
        const documentsObs = this.documentService.getDocuments('me', term, [], 4).catch(() => Observable.of([]));
        return Observable.forkJoin(partiesObs, documentsObs);
      })
      .map((result: any[]) => {
        return result[0].concat(result[1]);
      })

  constructor(
    private router: Router,
    private partyService: PartyService,
    private documentService: UBLDocumentService,
    private searchEventService: SearchEventService) {
    // Search events listener
    this.subscriptions.push(
      this.searchEventService.value.subscribe((searchEvent) => {
        this.typeaheadModel = searchEvent.keyword;
      })
    );
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  searchInputKeyPress($event: KeyboardEvent, textValue: string): void {
    if ($event.which === 13) {
      this.searchEventService.keyword(textValue);
    }
  }

  selectItem(val: any) {
    const type: string = val.item['type'];
    if (type === 'parties') {
      this.selectParty(<Party>val.item);
    } else if (type === 'ubl-document') {
      this.selectDocument(<UBLDocument>val.item);
    }
  }

  selectParty(party: Party) {
    this.searchEventService.keyword(party.attributes.name);
  }

  selectDocument(document: UBLDocument) {
    this.router.navigate(['/_home', document.id]);
  }

}
