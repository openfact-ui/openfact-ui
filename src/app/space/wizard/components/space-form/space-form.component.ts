import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ISpaceForm } from './../../models/spaceForm';

@Component({
  selector: 'ofs-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.scss'],
})

export class SpaceFormComponent implements OnInit, OnDestroy {

  @Output()
  public onChange = new EventEmitter<ISpaceForm>(null);

  public form: FormGroup;

  private subscription: Subscription;

  constructor(private formBuilder: FormBuilder) { }

  public ngOnInit() {
    this.form = this.formBuilder.group({
      assignedId: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      name: [null, Validators.compose([Validators.maxLength(250)])],
    });

    this.subscription = this.form.statusChanges.subscribe(() => {
      if (this.form.valid) {
        this.onChange.emit(<ISpaceForm>this.form.value);
      } else {
        this.onChange.emit(null);
      }
    });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
