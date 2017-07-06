import 'rxjs/add/operator/map';

import { Component, OnDestroy } from '@angular/core';

import { ErrorService } from './errror.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ofs-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnDestroy {

  message: string = '';
  subscription: Subscription;

  constructor(private errorService: ErrorService) {
    this.subscription = this.errorService.update$.subscribe(
      message => {
        this.message = message;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
