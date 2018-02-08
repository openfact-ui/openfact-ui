import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditDocumentComponent } from './edit-document.component';

const routes: Routes = [
  {
    path: '',
    component: EditDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditDocumentRoutingModule { }
