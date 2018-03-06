import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { SpaceLeaveComponent } from './space-leave.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    TranslateModule
  ],
  declarations: [
    SpaceLeaveComponent
  ],
  exports: [
    SpaceLeaveComponent
  ]
})
export class SpaceLeaveModule { }
