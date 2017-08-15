import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AboutService } from '../../shared/about.service';

@Component({
  selector: 'ofs-app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit {

  public showFooter = false;

  constructor(
    public router: Router,
    public about: AboutService) {

  }

  public ngOnInit() {
    setTimeout(() => {
      this.showFooter = true;
    }, 1000);
  }

  get isLandingPagePage(): boolean {
    return this.router.url === '/';
  }

}
