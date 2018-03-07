import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Space, SpaceService } from '../../ngx/ngx-clarksnut';
import { Broadcaster } from '../../ngx/ngx-base';

@Component({
  selector: 'cn-space-delete',
  templateUrl: 'space-delete.component.html'
})
export class SpaceDeleteComponent implements OnInit {

  @ViewChild('modalTemplate') wizardTemplate: TemplateRef<any>;

  private modalRef: BsModalRef;
  private space: Space;

  constructor(
    private broadcaster: Broadcaster,
    private modalService: BsModalService,
    private spaceService: SpaceService) {
  }

  ngOnInit() {

  }

  // Modal actions
  open(space: Space) {
    this.space = space;
    this.modalRef = this.modalService.show(this.wizardTemplate);
  }

  cancel() {
    this.close();
  }

  close() {
    this.modalRef.hide();
  }

  // Actions

  delete() {
    this.spaceService.deleteSpace('me', this.space).subscribe(
      (spaces) => {
        this.broadcaster.broadcast('spaceDeleted', this.space);
        this.close();
      },
      (err) => {
        console.log('Error al eliminar Espacio, inténtelo más tarde');
      }
    );
  }

}
