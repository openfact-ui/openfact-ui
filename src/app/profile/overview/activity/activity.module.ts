import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WidgetsModule } from 'ngx-widgets';
import { OpenfactSyncModule } from 'ngo-openfact-sync';
import { NgArrayPipesModule } from 'angular-pipes';

import { ActivityComponent } from './activity.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    NgArrayPipesModule,
    OpenfactSyncModule
  ],
  declarations: [ActivityComponent],
  exports: [ActivityComponent],
})
export class ActivityModule { }
