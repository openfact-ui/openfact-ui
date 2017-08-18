import { Component, Input } from '@angular/core';

@Component({
  selector: 'openfact-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent {

  @Input()
  public loading: boolean;

}
