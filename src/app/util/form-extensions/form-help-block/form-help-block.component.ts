import { Component, Input, OnInit } from '@angular/core';
import { FormControl, ControlContainer, AbstractControl } from '@angular/forms';

@Component({
  selector: 'form-help-block',
  templateUrl: './form-help-block.component.html',
  styleUrls: ['./form-help-block.component.scss']
})
export class FormHelpBlockComponent implements OnInit {

  @Input('formControlHelp')
  public name: string;

  public control: AbstractControl;

  constructor(private parent: ControlContainer) { }

  public ngOnInit() {
    this.control = this.parent.control.get(this.name);
  }

}
