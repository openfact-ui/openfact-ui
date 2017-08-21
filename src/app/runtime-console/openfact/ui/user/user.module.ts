import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ngx-modal';
import { UsersListPage } from './list-page/list-page.user.component';
import { UsersListComponent } from './list/list.user.component';
import { UserViewWrapperComponent } from './view-wrapper/view-wrapper.user.component';
import { UserViewToolbarComponent } from './view-toolbar/view-toolbar.user.component';
import { UserViewComponent } from './view/view.user.component';
import { UserEditWrapperComponent } from './edit-wrapper/edit-wrapper.user.component';
import { UserEditToolbarComponent } from './edit-toolbar/edit-toolbar.user.component';
import { UserEditComponent } from './edit/edit.user.component';
import { UserDeleteDialog } from './delete-dialog/delete-dialog.user.component';
import { OpenfactCommonModule } from '../../../common/common.module';
import { MomentModule } from 'angular2-moment';
import { UserViewPage } from './view-page/view-page.user.component';
import { UserEditPage } from './edit-page/edit-page.user.component';
import { UsersListToolbarComponent } from './list-toolbar/list-toolbar.user.component';
import { OpenfactComponentsModule } from '../../components/components.module';

const routes: Routes = [
  { path: '', component: UsersListPage },
  { path: ':id', component: UserViewPage },
  { path: ':id/edit', component: UserEditPage },
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(routes),
    RouterModule,
    OpenfactCommonModule,
    OpenfactComponentsModule,
  ],
  declarations: [
    UsersListPage,
    UsersListToolbarComponent,
    UsersListComponent,
    UserViewPage,
    UserViewWrapperComponent,
    UserViewToolbarComponent,
    UserViewComponent,
    UserEditPage,
    UserEditWrapperComponent,
    UserEditToolbarComponent,
    UserEditComponent,
    UserDeleteDialog,
  ],
  entryComponents: [
    UserDeleteDialog,
    UserEditPage,
  ],
  exports: [
    ModalModule,
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class UserModule {
}
