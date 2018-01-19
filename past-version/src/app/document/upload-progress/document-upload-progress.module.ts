import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DocumentProgressModule } from './document/document-progress.module';
import { DocumentUploadProgressComponent } from './document-upload-progress.component';

@NgModule({
  imports: [
    CommonModule,
    DocumentProgressModule
  ],
  declarations: [
    DocumentUploadProgressComponent,
  ],
  exports: [
    DocumentUploadProgressComponent,
  ],
  providers: [
  ]
})

export class DocumentUploadProgressModule {

}
