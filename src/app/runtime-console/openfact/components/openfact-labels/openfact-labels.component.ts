import { Component, Input } from '@angular/core';

@Component({
  selector: 'openfact-labels',
  templateUrl: './openfact-labels.component.html',
})
export class OpenfactLabelsComponent {

  @Input()
  public labels: Map<String, String>;

}
