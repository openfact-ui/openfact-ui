import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PopoverModule.forRoot(),
    GettingStartedRoutingModule
  ],
  declarations: [GettingStartedComponent],
})
export class GettingStartedModule {
  constructor() { }
}
