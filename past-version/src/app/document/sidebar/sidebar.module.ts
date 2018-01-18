import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http } from '@angular/http';

import { DocumentWizardModule } from './../wizard/document-wizard.module';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DocumentWizardModule
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent]
})
export class SidebarModule {
  constructor(http: Http) {
  }
}
