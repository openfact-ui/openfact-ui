import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'alm-overview',
    templateUrl: 'overview.component.html',
    styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnDestroy, OnInit {

    constructor(
        private router: Router) {
    }

    public ngOnInit() {
    }

    public ngOnDestroy() {

    }

}
