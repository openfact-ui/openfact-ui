import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
    pathMatch: 'full'
  },

  // Launcher
  {
    path: '_launcher',
    loadChildren: './launcher-page/launcher-page.module#LauncherPageModule',
    data: {
      title: 'Launcher'
    }
  },

  // Getting started
  {
    path: '_gettingstarted',
    loadChildren: './getting-started/getting-started.module#GettingStartedModule',
    data: {
      title: 'Getting Started'
    }
  },

  // Home
  {
    path: '_home',
    loadChildren: './home/home.module#HomeModule',
    data: {
      title: 'Home'
    }
  },

  // Error Pages
  {
    path: '_error',
    loadChildren: './layout/error/error.module#ErrorModule',
    data: {
      title: 'Error'
    }
  },

  /*{
    path: '**',
    redirectTo: '/_error'
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
