import { SpaceService } from './space.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { UserService } from '../../ngx-login-client';
import { SimpleChanges, OnChanges, Directive, Input, forwardRef } from '@angular/core';
import {
  AbstractControl,
  Validators,
  Validator,
  NG_ASYNC_VALIDATORS,
  AsyncValidatorFn
} from '@angular/forms';

@Directive({
  selector: '[cnUniqueSpaceAssignedId][ngModel]',
  providers: [{
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => UniqueSpaceAssignedIdValidatorDirective), multi: true
  }]
})
export class UniqueSpaceAssignedIdValidatorDirective implements Validator, OnChanges {


  @Input() uniqueSpaceAssignedId: boolean;

  private valFn: any;

  constructor(private spaceService: SpaceService, private userService: UserService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['uniqueSpaceAssignedId'];
    if (change) {
      this.valFn = uniqueSpaceAssignedIdValidator(this.spaceService, this.userService);
    } else {
      this.valFn = Validators.nullValidator;
    }
  }

  validate(control: AbstractControl): Observable<{ [key: string]: any }> {
    return this.valFn(control);
  }

}

export function uniqueSpaceAssignedIdValidator(
  spaceService: SpaceService,
  userService: UserService): AsyncValidatorFn {

  const changed$ = new Subject<any>();

  return (control: AbstractControl): Observable<{ [key: string]: any }> => {
    changed$.next();
    return control.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .takeUntil(changed$)
      .switchMap(value => userService.loggedInUser
        .switchMap(user => {
          return spaceService
            // tslint:disable-next-line:max-line-length
            .getSpaceByAssignedId(control.value ? control.value.replace(' ', '_') : control.value)
            .map(val => {
              return { unique: { valid: false, existingSpace: val, requestedName: control.value } };
            })
            .catch(val => {
              return Observable.of(null);
            });
        }))
      .first();
  };
}
