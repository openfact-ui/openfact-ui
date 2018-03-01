import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TranslateModule } from '@ngx-translate/core';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PopoverModule.forRoot(),
    TranslateModule,

    GettingStartedRoutingModule
  ],
  declarations: [GettingStartedComponent],
})
export class GettingStartedModule {
  constructor() { }
}
