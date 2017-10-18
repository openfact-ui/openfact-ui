import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { StartedRoutingModule } from './started-routing.module';
import { StartedComponent } from './started.component';

@NgModule({
  imports: [
    CommonModule,
    StartedRoutingModule
  ],
  declarations: [StartedComponent],
})
export class StartedModule {
  constructor(http: Http) {
  }
}
