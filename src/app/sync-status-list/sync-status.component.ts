import { Component } from '@angular/core';
import { AboutService } from '../shared/about.service';

@Component({
  selector: 'openfact-status-list',
  templateUrl: './sync-status.component.html',
  styleUrls: ['./sync-status.component.scss'],
})

export class SyncStatusComponent {

  constructor(public about: AboutService) {

  }

}
