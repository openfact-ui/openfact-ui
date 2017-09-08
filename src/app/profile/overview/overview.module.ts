import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap';

import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { ActivityModule } from './activity/activity.module';
import { SpacesModule } from './spaces/spaces.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    TabsModule.forRoot(),
    ActivityModule,
    SpacesModule
  ],
  declarations: [OverviewComponent],
})
export class OverviewModule {
  constructor(http: Http) { }
}
