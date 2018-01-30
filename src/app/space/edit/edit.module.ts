import { SidebarComponent } from './sidebar/sidebar.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';
import { EditRoutingModule } from './edit-routing.module';
import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EditRoutingModule
  ],
  declarations: [
    EditComponent,
    SidebarComponent,
    OverviewComponent
  ]
})
export class EditModule { }
