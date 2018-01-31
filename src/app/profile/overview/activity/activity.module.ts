import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ClarksnutModule } from '../../../ngx/ngx-clarksnut';
import { NgArrayPipesModule } from 'angular-pipes';

import { ActivityComponent } from './activity.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    NgArrayPipesModule,
    ClarksnutModule
  ],
  declarations: [ActivityComponent],
  exports: [ActivityComponent],
})
export class ActivityModule {
}
