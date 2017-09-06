import { Space } from 'ngo-openfact-sync';
import { Input } from '@angular/core';
import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ofs-recent-spaces-widget',
    templateUrl: './recent-spaces-widget.component.html',
    styleUrls: ['./recent-spaces-widget.component.scss']
})
export class RecentSpacesWidgetComponent implements OnInit {

    @Input()
    public spaces: Space[] = [];

    constructor() { }

    public ngOnInit() { }

}
