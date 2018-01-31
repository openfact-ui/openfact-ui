import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Directives
import { StopPropagationDirective } from './directives/stop-propagation.directive';

// Pipes
import { DateFromMilisPipe } from './pipes/date-from-milis';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    // Directives
    StopPropagationDirective,

    // Pipes
    DateFromMilisPipe,
  ],
  exports: [
    // Directives
    StopPropagationDirective,

    // Pipes
    DateFromMilisPipe,
  ]
})
export class UtilModule { }
