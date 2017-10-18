import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-started',
  templateUrl: 'started.component.html',
  styleUrls: ['./started.component.scss']
})
export class StartedComponent implements OnDestroy, OnInit {

  constructor() {
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
  }

}
