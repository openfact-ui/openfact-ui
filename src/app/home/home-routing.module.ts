import { ContextResolver } from './../shared/context-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { AuthGuard } from '../shared/auth-guard.service';

import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent,
    children: [
      { path: '', component: InboxComponent },
      {
        path: '_search',
        loadChildren: './search/search.module#SearchModule'
      },
      {
        path: ':document',
        resolve: {
          context: ContextResolver
        },
        loadChildren: './edit/edit.module#EditModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
