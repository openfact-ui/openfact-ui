import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeModule } from 'patternfly-ng';
import { MomentModule } from 'angular2-moment';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UtilModule } from '../util/util.module';

import { MailCollectorSettingRoutingModule } from './mail-collector-settings-routing.module';
import { MailCollectorSettingsComponent } from './mail-collector-settings.component';

@NgModule({
  imports: [
    CommonModule,
    PipeModule,
    MomentModule,
    BsDropdownModule,
    UtilModule,
    MailCollectorSettingRoutingModule
  ],
  declarations: [MailCollectorSettingsComponent]
})
export class MailCollectorSettingsModule { }
