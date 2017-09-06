import { SpaceWizardModule } from './../../space/wizard/space-wizard.module';
import { MomentModule } from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { RecentSpacesWidgetComponent } from './recent-spaces-widget.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        MomentModule,
        OpenfactSyncModule,
        SpaceWizardModule
    ],
    declarations: [RecentSpacesWidgetComponent],
    exports: [RecentSpacesWidgetComponent]
})
export class RecentSpacesWidgetModule { }
