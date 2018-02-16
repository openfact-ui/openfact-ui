import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MailCollectorSettingsComponent } from './mail-collector-settings.component';

const routes: Routes = [
  {
    path: '',
    component: MailCollectorSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MailCollectorSettingRoutingModule { }
