import { FormExtensionsModule } from './../../util/form-extensions/form-extensions.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http, HttpModule } from '@angular/http';

import { JWBootstrapSwitchModule } from 'jw-bootstrap-switch-ng2';
import { RemainingCharsCountModule } from 'patternfly-ng';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        UpdateRoutingModule,
        JWBootstrapSwitchModule,
        UpdateRoutingModule,
        RemainingCharsCountModule,
        FormExtensionsModule
    ],
    declarations: [UpdateComponent]
})
export class UpdateModule {
    constructor(http: Http) { }
}
