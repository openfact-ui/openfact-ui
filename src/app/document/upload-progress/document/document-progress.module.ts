import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DocumentProgressComponent } from './document-progress.component';

@NgModule({
    imports: [
        CommonModule,
        BsDropdownModule,
    ],
    declarations: [
        DocumentProgressComponent,
    ],
    exports: [
        DocumentProgressComponent,
    ],
    providers: [
    ]
})

export class DocumentProgressModule {

}
