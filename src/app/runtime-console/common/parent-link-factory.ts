import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

/**
 * Provides access to the parent link which works across
 * lazy loaded multi-hierarchy routing modules whereas '../' can often fail
 */
@Injectable()
export class ParentLinkFactory {
  public parentLink: string;

  constructor(router: Router) {
    let urlPrefix = router.url;
    if (urlPrefix) {
      let idx = urlPrefix.lastIndexOf('/');
      if (idx > 0) {
        urlPrefix = urlPrefix.substring(0, idx + 1);
      } else {
        urlPrefix = '../';
      }
    }
    this.parentLink = urlPrefix;
  }
}
