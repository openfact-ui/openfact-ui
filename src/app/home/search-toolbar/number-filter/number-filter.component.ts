import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';

import { DecimalPipe } from '@angular/common';

import { NumberFilterValue } from './number-filter-value';
import { NumberFilterConfig } from './number-filter-config';
import { NumberFilterField } from './number-filter-field';
import { NumberFilterEvent } from './number-filter-event';

import { cloneDeep, defaults, isEqual } from 'lodash';

/**
 * Sort component
 */
@Component({
  selector: 'ofs-number-filter',
  styleUrls: ['./number-filter.component.scss'],
  templateUrl: './number-filter.component.html',
  providers: [DecimalPipe]
})
export class NumberFilterComponent implements DoCheck, OnInit {

  /**
   * The filter config containing component properties
   */
  @Input() config: NumberFilterConfig;

  /**
   * The event emitted when the sort has changed
   */
  @Output('onChange') onChange = new EventEmitter();

  /**
   * Number modal
   */
  @ViewChild('customNumberModal') dateModal: any;

  rangeField: NumberFilterField = {
    id: 'customRange',
    title: 'Custom range'
  } as NumberFilterField;

  min: number;
  max: number;

  private currentField: NumberFilterField;
  private defaultConfig: NumberFilterConfig = {
    visible: true
  } as NumberFilterConfig;
  private prevConfig: NumberFilterConfig;

  /**
   * The default constructor
   */
  constructor(private decimalPipe: DecimalPipe) {
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

  selectCustomRange() {
    let customRangeField: NumberFilterField = {
      id: 'customXRange',
      title: this.decimalPipe.transform(this.min) + ' - ' + this.decimalPipe.transform(this.max),
      value: {
        min: this.min,
        max: this.max
      }
    } as NumberFilterField;

    this.selectField(customRangeField);
    this.dateModal.close();
  }

  private selectField(field: NumberFilterField): void {
    this.currentField = field;
    this.onChange.emit({
      field: this.currentField
    } as NumberFilterEvent);
  }

}
