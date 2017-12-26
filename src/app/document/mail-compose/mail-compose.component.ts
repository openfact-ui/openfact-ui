import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';

@Component({
  selector: 'ofs-mail-compose',
  templateUrl: './mail-compose.component.html',
  styleUrls: ['./mail-compose.component.scss'],
})
export class MailComposeComponent implements OnInit, OnDestroy {

  @Input() isButton: boolean;

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy(): void {

  }

}
