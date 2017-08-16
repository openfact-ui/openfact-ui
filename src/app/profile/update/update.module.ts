import { ModalModule } from 'ngx-modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { UpdateComponent } from './update.component';
import { UpdateRoutingModule } from './update-routing.module';

@NgModule({
    imports: [
        CommonModule,
        UpdateRoutingModule
    ],
    declarations: [UpdateComponent]
})
export class UpdateModule {
    constructor(http: Http) { }
}
