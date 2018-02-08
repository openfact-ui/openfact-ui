import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Directives
import { StopPropagationDirective } from './directives/stop-propagation.directive';

// Pipes
import { DateFromMilisPipe } from './pipes/date-from-milis';
import { MapValuesPipe } from './pipes/map-values.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    // Directives
    StopPropagationDirective,

    // Pipes
    DateFromMilisPipe,
    MapValuesPipe,
  ],
  exports: [
    // Directives
    StopPropagationDirective,

    // Pipes
    DateFromMilisPipe,
    MapValuesPipe,
  ]
})
export class UtilModule { }
