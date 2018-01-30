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
import { DocumentFilterComponent } from './document-filter/document-filter.component';

import { DateFromMilisPipe } from './pipes/date-from-milis';

import { ClarksnutModule } from './../ngx-clarksnut';
import { SpaceWizardModule } from '../space/wizard/space-wizard.module';
import { SpaceDeleteModule } from '../space/delete/space-delete.module';

import { SharedDirectivesModule } from './../shared-directives/shared-directives.module';

import { ListModule } from 'patternfly-ng/list/list.module';
import { EmptyStateModule } from 'patternfly-ng/empty-state/empty-state.module';
import { ActionModule } from 'patternfly-ng/action/action.module';

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
    SpaceDeleteModule,
    ClarksnutModule,
    SharedDirectivesModule,

    ListModule,
    EmptyStateModule,
    ActionModule
  ],
  declarations: [
    HomeComponent,
    LandsideComponent,
    SearchDocumentComponent,
    DocumentFilterComponent,

    DateFromMilisPipe,
  ],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
