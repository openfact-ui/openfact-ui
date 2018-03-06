import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { ISpaceForm } from '../../models/spaceForm';

@Component({
  selector: 'cn-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.scss'],
})

export class SpaceFormComponent implements OnInit, OnDestroy {

  @Output() change = new EventEmitter<ISpaceForm>(null);

  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      assignedId: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      description: [null, Validators.compose([Validators.maxLength(250)])],
    });

    this.subscriptions.push(
      this.form.statusChanges.subscribe(() => {
        if (this.form.valid) {
          this.change.emit(<ISpaceForm>this.form.value);
        } else {
          this.change.emit(null);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

}
