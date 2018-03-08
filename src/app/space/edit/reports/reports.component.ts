import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Space, Context, UBLDocument, UBLDocumentService } from './../../../ngx/ngx-clarksnut';
import { ContextService } from './../../../ngx-impl/ngx-clarksnut-impl/context.service';

@Component({
  selector: 'cn-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  context: Context;

  items: UBLDocument[] = [];
  totalItems: number;
  facets: Map<string, any> = new Map<string, any>();

  offset = 0;
  limit = 10;

  private subscriptions: Subscription[] = [];

  constructor(
    private contexts: ContextService,
    private documentService: UBLDocumentService
  ) {
    this.subscriptions.push(
      this.contexts.current.subscribe(val => {
        this.context = val;
      })
    );
  }

  ngOnInit() {
    this.search();
  }

  get space(): Space {
    return this.context.space;
  }

  search() {
    // if (!this.queryBuilder) {
    //   this.queryBuilder = DocumentQuery.builder();
    // }

    // this.queryBuilder.spaces([this.space.id]);

    // this.queryBuilder.offset(this.offset || 0);
    // this.queryBuilder.limit(this.limit || 10);

    // this.documentService.search(this.queryBuilder.build().query()).subscribe((searchResult) => {
    //   this.items = searchResult.data;
    //   this.totalItems = searchResult.totalResults;
    //   this.facets = searchResult.facets;
    // });
  }

}
