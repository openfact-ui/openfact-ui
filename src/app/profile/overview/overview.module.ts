import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'ngx-bootstrap';

import { ActivityModule } from './activity/activity.module';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { SpacesModule } from './spaces/spaces.module';

@NgModule({
  imports: [
    ActivityModule,
    CommonModule,
    OverviewRoutingModule,
    SpacesModule,
    TabsModule.forRoot(),
  ],
  declarations: [OverviewComponent],
})
export class OverviewModule { }
