import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { AddSpacesDialogModule } from './../add-spaces-dialog/add-spaces-dialog.module';

import { SpaceTabsComponent } from './space-tabs.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    OpenfactSyncModule,
    AddSpacesDialogModule
  ],
  declarations: [SpaceTabsComponent],
  exports: [SpaceTabsComponent]
})
export class SpaceTabsModule { }
