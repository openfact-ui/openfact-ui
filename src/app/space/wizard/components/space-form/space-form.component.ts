import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';
import { Space, SpaceAttributes, SpaceRelatedLink } from './../../../../ngx/ngx-clarksnut';

@Component({
  selector: 'cn-space-form',
  templateUrl: './space-form.component.html',
  styleUrls: ['./space-form.component.scss'],
})

export class SpaceFormComponent implements OnInit, OnDestroy {

  @Output() spaceChange = new EventEmitter<Space>();
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      assignedId: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      description: [null, Validators.compose([Validators.maxLength(250)])],
    });

    this.form.statusChanges.subscribe(() => {
      if (this.form.valid) {
        const space = this.createTransientSpace();
        space.attributes.name = this.form.value.name;
        space.attributes.assignedId = this.form.value.assignedId;
        space.attributes.description = this.form.value.description;


        this.spaceChange.emit(space);
      } else {
        this.spaceChange.emit(null);
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createTransientSpace(): Space {
    const space = {} as Space;
    space.type = 'spaces';
    space.attributes = new SpaceAttributes();
    space.relationships = {
      collaborators: {} as SpaceRelatedLink,
      ownedBy: {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    return space;
  }

}
