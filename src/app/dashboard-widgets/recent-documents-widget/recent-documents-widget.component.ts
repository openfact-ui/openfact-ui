import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ofs-recent-documents-widget',
    templateUrl: './recent-documents-widget.component.html',
    styleUrls: ['./recent-documents-widget.component.scss']
})
export class RecentDocumentsWidgetComponent implements OnInit, OnDestroy {

    constructor() { }

    public ngOnInit() {

    }

    public ngOnDestroy() {

    }

}
