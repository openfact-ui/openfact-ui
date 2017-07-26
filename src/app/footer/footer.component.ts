import { Component } from '@angular/core';
import { AboutService } from '../shared/about.service';

@Component({
  selector: 'ofs-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent {

  constructor(public about: AboutService) {

  }

}
