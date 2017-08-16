import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ofs-repositories-widget',
    templateUrl: './repositories-widget.component.html',
    styleUrls: ['./repositories-widget.component.scss']
})
export class RepositoriesWidgetComponent implements OnInit, OnDestroy {

    constructor() { }

    public ngOnInit() {

    }

    public ngOnDestroy() {

    }

}
