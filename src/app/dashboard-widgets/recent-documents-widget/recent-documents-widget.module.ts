import { PatternFlyNgModule } from 'patternfly-ng';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecentDocumentsWidgetComponent } from './recent-documents-widget.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MomentModule,
        PatternFlyNgModule
    ],
    declarations: [RecentDocumentsWidgetComponent],
    exports: [RecentDocumentsWidgetComponent]
})
export class RecentDocumentsWidgetModule { }
