import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

import { InputModule } from './input/input.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    InputModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
