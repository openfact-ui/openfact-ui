import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'ofs-mail-compose',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
})
export class MailComposeComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

}
