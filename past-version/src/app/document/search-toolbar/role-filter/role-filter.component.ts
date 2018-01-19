import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { RoleFilterConfig } from './role-filter-config';
import { RoleFilterField } from './role-filter-field';
import { RoleFilterEvent } from './role-filter-event';

import { cloneDeep, defaults, isEqual } from 'lodash';

/**
 * Sort component
 */
@Component({
  selector: 'ofs-role-filter',
  styleUrls: ['./role-filter.component.scss'],
  templateUrl: './role-filter.component.html',
  host: {
    'class': 'input-group-btn'
  }
})
export class RoleFilterComponent implements DoCheck, OnInit {

  /**
   * The filter config containing component properties
   */
  @Input() config: RoleFilterConfig;

  /**
   * The event emitted when the sort has changed
   */
  @Output('onChange') onChange = new EventEmitter();

  private currentField: RoleFilterField;
  private defaultConfig: RoleFilterConfig = {
    visible: true
  } as RoleFilterConfig;
  private prevConfig: RoleFilterConfig;

  /**
   * The default constructor
   */
  constructor() {
  }

  /**
   *  Setup component configuration upon initialization
   */
  ngOnInit(): void {
    this.setupConfig();
  }

  /**
   *  Check if the component config has changed
   */
  ngDoCheck(): void {
    // Do a deep compare on config
    if (!isEqual(this.config, this.prevConfig)) {
      this.setupConfig();
    }
  }

  /**
   * Set up default config
   */
  protected setupConfig(): void {
    if (this.config !== undefined) {
      defaults(this.config, this.defaultConfig);
    } else {
      this.config = cloneDeep(this.defaultConfig);
    }

    if (this.config && this.config.fields && this.config.fields.length > 0) {
      if (this.currentField === undefined) {
        this.currentField = this.config.fields[0];
      }
    }
  }

  // Actions

  private selectField(field: RoleFilterField): void {
    this.currentField = field;
    this.onChange.emit({
      field: this.currentField
    } as RoleFilterEvent);
  }

}
