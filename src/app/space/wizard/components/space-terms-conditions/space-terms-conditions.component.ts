import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'cn-space-terms-conditions',
  templateUrl: './space-terms-conditions.component.html',
  styleUrls: ['./space-terms-conditions.component.scss'],
})

export class SpaceTermsConditionsComponent implements OnInit, OnDestroy {

  @Output() onChange = new EventEmitter<boolean>(false);

  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      agree: [null, Validators.compose([Validators.requiredTrue])]
    });

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        this.onChange.emit(this.form.valid);
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

}
