import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs/Subscription';

import { SearchEvent } from './../models/search-event';
import { SearchEventService } from './../shared/search-event.service';

@Component({
  selector: 'cn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  selectedTabId = 'all';

  constructor(
    renderer: Renderer2,
    @Inject(DOCUMENT) document: Document,
    private searchEventService: SearchEventService) {
    renderer.removeClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  selectTab(tabId: string) {
    this.selectedTabId = tabId;

    const event = new SearchEvent();
    event.star = null;
    event.view = null;
    event.check = null;

    if (this.selectedTabId === 'all') {

    } else if (this.selectedTabId === 'star') {
      event.star = true;
    } else if (this.selectedTabId === 'not-read') {
      event.view = false;
    } else if (this.selectedTabId === 'not-checked') {
      event.check = false;
    }

    this.searchEventService.patch(event);
  }
}
