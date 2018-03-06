import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityComponent } from './security.component';
import { SecurityRoutingModule } from './security-routing.module';

@NgModule({
  imports: [CommonModule, SecurityRoutingModule],
  declarations: [SecurityComponent],
})
export class SecurityModule { }
