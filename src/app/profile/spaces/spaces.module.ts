import { ModalModule } from 'ngx-modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { SpacesComponent } from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SpacesRoutingModule,
        ModalModule
    ],
    declarations: [SpacesComponent]
})
export class SpacesModule {
    constructor(http: Http) { }
}
