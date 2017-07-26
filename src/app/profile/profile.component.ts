import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'ofs-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    constructor(
        private router: Router) {
    }

    public ngOnInit() { }

}
