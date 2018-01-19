import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'ofs-space-terms-conditions',
  templateUrl: './space-terms-conditions.component.html',
  styleUrls: ['./space-terms-conditions.component.scss'],
})

export class SpaceTermsConditionsComponent implements OnInit, OnDestroy {

  @Output()
  public onChange = new EventEmitter<boolean>(false);

  public form: FormGroup;

  private subscription: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      agree: [null, Validators.compose([Validators.requiredTrue])]
    });

    this.subscription = this.form.statusChanges.subscribe(() => {
      this.onChange.emit(this.form.valid);
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
