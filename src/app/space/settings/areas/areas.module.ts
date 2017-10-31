import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { AreasComponent } from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AreasRoutingModule,
  ],
  declarations: [
    AreasComponent
  ],
  providers: [

  ]
})
export class AreasModule {
  constructor(http: Http) { }
}
