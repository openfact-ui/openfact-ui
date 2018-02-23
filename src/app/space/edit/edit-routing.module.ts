import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditComponent } from './edit.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    component: EditComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: '_reports',
        loadChildren: './reports/reports.module#ReportsModule'
      },
      {
        path: '_collaborators',
        loadChildren: './collaborators/collaborators.module#CollaboratorsModule'
      },
      {
        path: '_settings',
        loadChildren: './settings/settings.module#SettingsModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
