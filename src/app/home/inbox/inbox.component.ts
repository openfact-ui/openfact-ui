import { Space, UBLDocumentService } from 'ngo-openfact-sync';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ofs-inbox',
  templateUrl: 'inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnDestroy, OnInit {

  categorizedSpaces: Space[] = [];

  constructor(private documentService: UBLDocumentService) {
  }

  public ngOnInit() {
  }

  public ngOnDestroy(): void {
  }

  search($event) {
    console.log($event);
    this.documentService.search($event).subscribe((data) => {
      console.log(data);
    });
  }

}
