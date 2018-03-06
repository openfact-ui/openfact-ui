import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { CnUserName } from './user/cn-user-name.pipe';

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [
    CnUserName
  ],
  exports: [
    CnUserName
  ]
})
export class LoginModule { }
