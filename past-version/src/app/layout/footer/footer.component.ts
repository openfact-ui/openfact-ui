import { Component, ViewEncapsulation } from '@angular/core';
import { AboutService } from '../../shared/about.service';

@Component({
  selector: 'ofs-app-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent {

  constructor(public about: AboutService) {

  }

}
