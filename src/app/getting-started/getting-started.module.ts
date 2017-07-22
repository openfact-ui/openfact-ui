import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { GettingStartedComponent } from './getting-started.component';
import { GettingStartedRoutingModule } from './getting-started-routing.module';

import { EmptyStateModule } from 'patternfly-ng';

@NgModule({
  imports: [CommonModule, FormsModule, GettingStartedRoutingModule, EmptyStateModule],
  declarations: [GettingStartedComponent],
})
export class GettingStartedModule {
  constructor() { }
}
