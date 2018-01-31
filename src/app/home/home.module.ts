import { FilterDocumentModule } from './../document/filter-document/filter-document.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http } from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';
import { NgUploaderModule } from 'ngx-uploader';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LandsideComponent } from './landside/landside.component';
import { SearchDocumentComponent } from './search-document/search-document.component';

import { ClarksnutModule } from '../ngx/ngx-clarksnut';

import { SpaceWizardModule } from '../space/wizard/space-wizard.module';
import { ImportDocumentModule } from '../document/import-document/import-document.module';

import { SpaceDeleteModule } from '../space/delete/space-delete.module';

import { ListModule } from 'patternfly-ng/list/list.module';
import { EmptyStateModule } from 'patternfly-ng/empty-state/empty-state.module';
import { ActionModule } from 'patternfly-ng/action/action.module';
import { UtilModule } from '../util/util.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    BsDropdownModule,
    TranslateModule,
    MomentModule,
    NgUploaderModule,

    SpaceWizardModule,
    ImportDocumentModule,

    SpaceDeleteModule,
    ClarksnutModule,
    UtilModule,

    ListModule,
    EmptyStateModule,
    ActionModule,

    FilterDocumentModule
  ],
  declarations: [
    HomeComponent,
    LandsideComponent,
    SearchDocumentComponent,
  ],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
