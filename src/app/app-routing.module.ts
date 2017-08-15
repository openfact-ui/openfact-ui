import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: './landing-page/landing-page.module#LandingPageModule',
    pathMatch: 'full'
  },

  // Home
  {
    path: '_home',
    loadChildren: './home/home.module#HomeModule',
    data: {
      title: 'Home'
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

  // Error Pages
  {
    path: '_error',
    loadChildren: './layout/error/error.module#ErrorModule',
    data: {
      title: 'Error'
    }
  },

  // Profile
  {
    path: ':entity',
    resolve: {
      // context: ContextResolver
    },
    loadChildren: './profile/profile.module#ProfileModule',
    data: {
      title: 'Profile'
    }
  },

  {
    path: '**',
    redirectTo: '/_error'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
