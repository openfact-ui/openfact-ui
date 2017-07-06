import { AboutModalComponent } from './about-modal.component';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot()
  ],
  declarations: [
    AboutModalComponent
  ],
  exports: [
    AboutModalComponent,
    ModalModule
  ]
})
export class AboutModalModule { }
