import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ListModule } from 'patternfly-ng/list';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { ActionModule } from 'patternfly-ng/action';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ClarksnutModule } from './../../ngx/ngx-clarksnut/clarksnut.module';
import { UtilModule } from '../../util/util.module';

import { InboxDocumentComponent } from './inbox-document.component';
import { FilterDocumentComponent } from './filter-document/filter-document.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    ListModule,
    EmptyStateModule,
    ActionModule,

    BsDropdownModule,
    TooltipModule,
    ClarksnutModule,
    UtilModule
  ],
  declarations: [
    InboxDocumentComponent,
    FilterDocumentComponent
  ]
})
export class InboxDocumentModule { }
