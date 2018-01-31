import { UBLDocument } from '../ngx/ngx-clarksnut/models/ubl-document';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'

import { Subscription } from 'rxjs';

import { Space, Spaces, SpaceService, Context, Contexts } from '../ngx/ngx-clarksnut';
import { UserService, User } from '../ngx/ngx-login-client';

import { Logger } from '../ngx/ngx-base';
import { BrandInformation } from '../models/brand-information';
import { UploaderOptions } from 'ngx-uploader';

import { ListConfig } from 'patternfly-ng/list/list.module';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  listConfig: ListConfig;
  emptyStateConfig: EmptyStateConfig;

  documents: UBLDocument[] = [];

  // Search
  searchKeyword: string;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    this.renderer.removeClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
    this.emptyStateConfig = {
      iconStyleClass: 'pficon-info',
      title: 'No results match',
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;
  }

  ngOnDestroy() {

  }

  onKeywordChange(keyword: string) {
    this.searchKeyword = keyword;
  }

}
