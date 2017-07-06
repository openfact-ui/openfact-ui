import { Component, OnInit } from '@angular/core';

import { AboutService } from './../shared/about.service';

@Component({
  selector: 'ofs-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(public about: AboutService) { }

  ngOnInit() {
  }

}
