import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { ModalModule } from 'ngx-modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { InfiniteScrollModule } from 'ngx-widgets';
import { SpaceWizardModule } from './../../space/wizard/space-wizard.module';

import { SpacesComponent } from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';

@NgModule({
    imports: [
        CommonModule,
        SpacesRoutingModule,
        ModalModule,
        SpaceWizardModule,
        InfiniteScrollModule,
        OpenfactSyncModule,
    ],
    declarations: [SpacesComponent]
})
export class SpacesModule {
    constructor(http: Http) { }
}
