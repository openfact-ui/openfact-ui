import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap';
import { DocumentProgressModule } from './document/document-progress.module';
import { DocumentUploadProgressComponent } from './document-upload-progress.component';

@NgModule({
    imports: [
        CommonModule,
        ModalModule,
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
