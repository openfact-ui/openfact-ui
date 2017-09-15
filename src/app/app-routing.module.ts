import {ProfileResolver} from './shared/profile-resolver.service';
import {ContextResolver} from './shared/context-resolver.service';
import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';

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

  // // Error Pages
  // {
  //   path: '_error',
  //   loadChildren: './layout/error/error.module#ErrorModule',
  //   data: {
  //     title: 'Error'
  //   }
  // },
  //
  // // Profile
  // {
  //   path: '_profile',
  //   resolve: {
  //     context: ProfileResolver
  //   },
  //   loadChildren: './profile/profile.module#ProfileModule',
  //   data: {
  //     title: 'Profile'
  //   }
  // },
  //
  // {
  //   path: ':entity',
  //   resolve: {
  //     context: ContextResolver
  //   },
  //   loadChildren: './profile/profile.module#ProfileModule',
  //   data: {
  //     title: 'Profile'
  //   }
  // },
  //
  // // Analyze
  // {
  //   path: ':entity/:space',
  //   resolve: {
  //     context: ContextResolver
  //   },
  //   loadChildren: './space/analyze/analyze.module#AnalyzeModule',
  //   data: {
  //     title: 'Analyze'
  //   }
  // },
  //
  // // Space-settings
  // {
  //   path: ':entity/:space/settings',
  //   resolve: {
  //     context: ContextResolver
  //   },
  //   loadChildren: './space/settings/space-settings.module#SpaceSettingsModule',
  //   data: {
  //     title: 'Areas'
  //   }
  // },
  //
  // {
  //   path: '**',
  //   redirectTo: '/_error'
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
