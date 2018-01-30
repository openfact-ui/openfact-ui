import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser'

@Component({
  selector: 'cn-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {
    this.renderer.addClass(document.body, 'has-project-bar');
  }

  ngOnInit() {
  }

}
