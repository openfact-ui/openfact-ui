import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OnInit, Component, Input, Inject, OnDestroy, Output } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
import { SearchEventService } from './../../shared/search-event.service';
import { Space, Party, PartyService } from './../../ngx/ngx-clarksnut';

@Component({
  selector: 'cn-search-document',
  templateUrl: './search-document.component.html',
  styleUrls: ['./search-document.component.scss'],
})
export class SearchDocumentComponent implements OnInit, OnDestroy {

  form: FormGroup;
  parties: Party[] = [];
  spaces: Space[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private partyService: PartyService,
    private searchEventService: SearchEventService) {
    // Form
    this.form = this.formBuilder.group({
      filterText: [null, Validators.compose([Validators.required, Validators.maxLength(255)])]
    });

    this.subscriptions.push(
      this.form.get('filterText').valueChanges
        .debounceTime(50)
        .distinctUntilChanged()
        .subscribe((value) => {
          this.partyService.getParties(value, this.spaces, 3).subscribe((parties) => {
            this.parties = parties;
          });
        })
    );

    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((event) => {
        if (event) {
          this.form.patchValue({
            filterText: event.keyword
          });
        }
      })
    );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  searchInputKeyPress($event: KeyboardEvent): void {
    if ($event.which === 13) {
      this.searchEventService.emitEvent({
        keyword: this.form.value.filterText
      });
    }
  }

  selectParty(party: Party) {
    this.searchEventService.emitEvent({
      keyword: party.attributes.name
    });
  }

}
