import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LauncherPageComponent } from './launcher-page.component';

const routes: Routes = [
  {
    path: '',
    component: LauncherPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LauncherPageRoutingModule {
}
