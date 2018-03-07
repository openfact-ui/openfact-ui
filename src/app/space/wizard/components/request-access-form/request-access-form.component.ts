import { Router } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { User, UserService } from '../../../../ngx/ngx-login-client';
import { Space, RequestAccessToSpace, RequestAccessToSpaceAttributes, RequestAccessRelationalData } from '../../../../ngx/ngx-clarksnut';

@Component({
  selector: 'cn-request-access-form',
  templateUrl: './request-access-form.component.html',
  styleUrls: ['./request-access-form.component.scss'],
})

export class RequestAccessFormComponent implements OnInit, OnDestroy {

  @Input() space: Space;
  @Output() requestChange = new EventEmitter<RequestAccessToSpace>();

  loggedInUser: User;
  form: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService) {
    this.subscriptions.push(
      this.userService.loggedInUser.subscribe((val) => {
        this.loggedInUser = val;
      })
    );
  }

  ngOnInit() {
    const owner = this.space.relationalData.owner;
    const spaceOwner = owner.attributes.username;

    this.form = this.formBuilder.group({
      currentOwner: [spaceOwner, Validators.compose([Validators.maxLength(220)])],
      requestMessage: [null, Validators.compose([Validators.required, Validators.maxLength(250)])]
    });

    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => {
        if (this.form.valid) {
          const request = this.createTransientRequest();
          request.attributes.message = this.form.value.requestMessage;
          this.requestChange.emit(request);
        } else {
          this.requestChange.emit(null);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  private createTransientRequest(): RequestAccessToSpace {
    const request = {} as RequestAccessToSpace;
    request.type = 'request-access';
    request.attributes = new RequestAccessToSpaceAttributes();

    request.attributes.scope = 'collaborator';
    request.attributes.space = this.space.id;
    request.attributes.user = this.loggedInUser.id;
    return request;
  }

}
