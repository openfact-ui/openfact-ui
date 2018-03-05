import { Party, PartyService } from './../../../../ngx/ngx-clarksnut';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Space } from './../../../../ngx/ngx-clarksnut';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cn-party-filter',
  templateUrl: './party-filter.component.html',
  styleUrls: ['./party-filter.component.scss']
})
export class PartyFilterComponent implements OnInit {

  @Input() space: Space;
  @Input() limit: number;

  form: FormGroup;
  parties: Party[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private partyService: PartyService
  ) {
    this.form = this.formBuilder.group({
      filterText: [null, Validators.compose([Validators.required, Validators.maxLength(255)])]
    });

    this.subscriptions.push(
      this.form.get('filterText').valueChanges
        .debounceTime(50)
        .distinctUntilChanged()
        .subscribe((value) => {
          this.partyService.getParties('me', value, [this.space], this.limit).subscribe((parties) => {
            this.parties = parties;
          });
        })
    );
  }

  ngOnInit() {
  }

}
