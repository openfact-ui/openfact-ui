import { ValidSpaceNameValidatorDirective } from './spaces/valid-space-name.directive';
import { ValidSpaceAssignedIdValidatorDirective } from './spaces/valid-space-assigned-id.directive';
import { UniqueSpaceAssignedIdValidatorDirective } from './spaces/unique-space-assigned-id.directive';

import { SpaceNamePipe } from './spaces/space-name.pipe';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [
  ],
  declarations: [
    SpaceNamePipe,
    ValidSpaceNameValidatorDirective,
    ValidSpaceAssignedIdValidatorDirective,
    UniqueSpaceAssignedIdValidatorDirective
  ],
  exports: [
    SpaceNamePipe,
    ValidSpaceNameValidatorDirective,
    ValidSpaceAssignedIdValidatorDirective,
    UniqueSpaceAssignedIdValidatorDirective
  ],
  providers: [
    SpaceNamePipe
  ]
})
export class ClarksnutModule {
}
