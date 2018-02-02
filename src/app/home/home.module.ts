import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Http } from '@angular/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { MomentModule } from 'angular2-moment';

import { HomeRoutingModule } from './home-routing.module';
import { ClarksnutModule } from '../ngx/ngx-clarksnut';
import { SpaceWizardModule } from '../space/wizard/space-wizard.module';
import { SpaceDeleteModule } from '../space/delete/space-delete.module';
import { ImportDocumentModule } from '../document/import-document/import-document.module';
import { SearchDocumentModule } from './../document/search-document/search-document.module';
import { UtilModule } from '../util/util.module';

import { HomeComponent } from './home.component';
import { LandsideComponent } from './landside/landside.component';

import { InboxDocumentModule } from './../document/inbox-document/inbox-document.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,

    BsDropdownModule,
    TranslateModule,
    MomentModule,

    SpaceWizardModule,
    ImportDocumentModule,
    SearchDocumentModule,
    SpaceDeleteModule,
    ClarksnutModule,
    UtilModule,

    InboxDocumentModule
  ],
  declarations: [
    HomeComponent,
    LandsideComponent,
  ],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
