import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[cnStopPropagation]'
})
export class StopPropagationDirective {

  constructor() { }

  @HostListener("click", ["$event"]) onClick(event: any): void {
    event.stopPropagation();
  }

}
