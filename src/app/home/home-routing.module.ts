import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { InboxDocumentComponent } from '../document/inbox-document/inbox-document.component';

import { ContextResolver } from './../ngx-impl/ngx-clarksnut-impl/context-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: InboxDocumentComponent },
      {
        path: ':document',
        resolve: {
          context: ContextResolver
        },
        loadChildren: '../document/edit-document/edit-document.module#EditDocumentModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
