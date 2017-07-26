import {
    Component,
    Renderer2,
    ViewChild,
    OnInit,
    Output,
    AfterViewInit,
    ElementRef,
    EventEmitter,
    Input,
    ViewEncapsulation
} from '@angular/core';

import { AboutService } from '../shared/about.service';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'fab-about-modal',
    templateUrl: './about-modal.component.html',
    styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements AfterViewInit {

    @ViewChild('staticModal')
    public staticModal: any;

    constructor(
        public about: AboutService,
        public renderer: Renderer2
    ) { }

    public ngAfterViewInit() { }

    public open() {
        this.staticModal.show();
    }

}
