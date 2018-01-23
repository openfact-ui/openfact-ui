import { Component } from '@angular/core';
import { AboutService } from '../../shared/about.service';

@Component({
  selector: 'cn-footer',
  templateUrl: './footer.component.html'
})

export class FooterComponent {

  constructor(public about: AboutService) {

  }

}
