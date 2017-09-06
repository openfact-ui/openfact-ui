import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { SpacesWidgetComponent } from './spaces-widget.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MomentModule,
        OpenfactSyncModule
    ],
    declarations: [SpacesWidgetComponent],
    exports: [SpacesWidgetComponent]
})
export class SpacesWidgetModule { }
