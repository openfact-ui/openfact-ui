import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MailComposeComponent } from './mail-compose.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MailComposeComponent,
  ],
  exports: [
    MailComposeComponent,
  ],
  providers: [

  ]
})

export class MailComposeModule {

}
