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
import { ImportDocumentComponent } from './import-document/import-document.component';
import { DocumentFilterComponent } from './document-filter/document-filter.component';

import { SpaceWizardModule } from '../space/wizard/space-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HomeRoutingModule,
    BsDropdownModule,
    TranslateModule,
    MomentModule,
    NgUploaderModule,
    SpaceWizardModule
  ],
  declarations: [
    HomeComponent,
    LandsideComponent,
    SearchDocumentComponent,
    ImportDocumentComponent,
    DocumentFilterComponent
  ],
  providers: [
  ]
})
export class HomeModule {
  constructor(http: Http) {
  }
}
