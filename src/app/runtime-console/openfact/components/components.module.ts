import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenfactCommonModule } from '../../common/common.module';
import { OpenfactLabelsComponent } from './openfact-labels/openfact-labels.component';
import { BuildStatusIconComponent } from './build-status-icon/build-status-icon.component';

@NgModule({
  imports: [
    CommonModule,
    OpenfactCommonModule,
  ],
  declarations: [
    BuildStatusIconComponent,
    OpenfactLabelsComponent,
  ],
  exports: [
    BuildStatusIconComponent,
    OpenfactLabelsComponent,
  ],
})
export class OpenfactComponentsModule {
}
