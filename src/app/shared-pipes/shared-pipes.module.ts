import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFromMilisPipe } from './date-from-milis';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateFromMilisPipe
  ],
  exports: [
    DateFromMilisPipe
  ]
})
export class SharedPipesModule { }
