import { Http, HttpModule } from '@angular/http';

import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error-routing.module';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ErrorRoutingModule,
  ],
  declarations: [ErrorComponent]
})
export class ErrorModule {
  constructor(http: Http) { }
}
