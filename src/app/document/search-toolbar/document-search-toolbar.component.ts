import { Subject, Subscription } from 'rxjs';
import { OnInit, Component, Input, EventEmitter, Inject, OnDestroy } from '@angular/core';

@Component({
    selector: 'ofs-document-search-toolbar',
    templateUrl: './document-search-toolbar.component.html',
    styleUrls: ['./document-search-toolbar.component.scss'],
})
export class DocumentSearchToolbarComponent implements OnInit, OnDestroy {

    constructor() { }

    public ngOnInit() {

    }

    public ngOnDestroy(): void {

    }

}
