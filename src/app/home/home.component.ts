import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    this.renderer.removeClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
