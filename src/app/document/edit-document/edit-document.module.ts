import { EditDocumentRoutingModule } from './edit-document-routing.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditDocumentComponent } from './edit-document.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MomentModule } from 'angular2-moment/moment.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MomentModule,
    EditDocumentRoutingModule
  ],
  declarations: [
    EditDocumentComponent,
    ToolbarComponent
  ]
})
export class EditDocumentModule { }
