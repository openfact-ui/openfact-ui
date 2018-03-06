import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsOverviewComponent } from './settings-overview.component';
import { SettingsOverviewRoutingModule } from './settings-overview-routing.module';

@NgModule({
  imports: [CommonModule, SettingsOverviewRoutingModule],
  declarations: [SettingsOverviewComponent],
})
export class SettingsOverviewModule { }
