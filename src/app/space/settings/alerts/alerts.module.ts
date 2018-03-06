import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsComponent } from './alerts.component';
import { AlertsRoutingModule } from './alerts-routing.module';

@NgModule({
  imports: [CommonModule, AlertsRoutingModule],
  declarations: [AlertsComponent],
})
export class AlertsModule { }
