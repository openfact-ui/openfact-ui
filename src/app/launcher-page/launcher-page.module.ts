import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { LauncherPageComponent } from './launcher-page.component';
import { LauncherPageRoutingModule } from './launcher-page-routing.module';

@NgModule({
  imports: [CommonModule, LauncherPageRoutingModule],
  declarations: [LauncherPageComponent]
})
export class LauncherPageModule {
  constructor() { }
}
