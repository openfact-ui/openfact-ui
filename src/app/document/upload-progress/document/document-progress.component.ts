import { UploadFile } from 'ngx-uploader';
import { OnInit, Component, Input, Inject } from '@angular/core';

@Component({
  selector: 'ofs-document-progress',
  templateUrl: './document-progress.component.html',
  styleUrls: ['./document-progress.component.scss'],
})
export class DocumentProgressComponent implements OnInit {

  @Input() file: UploadFile;

  constructor() { }

  public ngOnInit() {

  }

}
