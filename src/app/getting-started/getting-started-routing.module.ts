import { RouterModule, Routes } from '@angular/router';

import { GettingStartedComponent } from './getting-started.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    canActivate: [],
    component: GettingStartedComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GettingStartedRoutingModule {}
