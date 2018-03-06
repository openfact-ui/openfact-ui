import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';

import { SpaceDeleteComponent } from './space-delete.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule,
    TranslateModule
  ],
  declarations: [
    SpaceDeleteComponent
  ],
  exports: [
    SpaceDeleteComponent
  ]
})
export class SpaceDeleteModule { }
