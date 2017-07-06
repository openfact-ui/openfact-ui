import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
