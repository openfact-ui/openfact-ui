import { Component, OnInit, Output, EventEmitter, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';

import { Period } from './period';

@Component({
  selector: 'cn-document-period-picker',
  templateUrl: './document-period-picker.component.html',
  styleUrls: ['./document-period-picker.component.scss']
})
export class DocumentPeriodPickerComponent implements OnInit {

  @Output() change = new EventEmitter<Period>();
  @ViewChild('daterangePicker', { read: ViewContainerRef }) daterangePickerParentViewContainer: ViewContainerRef;

  private title: string;
  private from: Date;
  private to: Date;

  constructor(private componentFactory: ComponentFactoryResolver) { }

  ngOnInit() {
  }

  lastMonth() {
    const date = new Date();
    this.from = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    this.to = new Date(date.getFullYear(), date.getMonth(), 0);

    this.change.emit({
      from: this.from,
      to: this.to,
      title: 'My date'
    });
  }

  /**
   * Months
   */

  setMonth(month: number) {
    const date = new Date();
    this.from = new Date(date.getFullYear(), month, 1);
    this.to = new Date(date.getFullYear(), month + 1, 0);

    this.change.emit({
      from: this.from,
      to: this.to,
      title: 'My date'
    });
  }

  january() {
    this.setMonth(0);
  }

  february() {
    this.setMonth(1);
  }

  march() {
    this.setMonth(2);
  }

  april() {
    this.setMonth(3);
  }

  may() {
    this.setMonth(4);
  }

  june() {
    this.setMonth(5);
  }

  july() {
    this.setMonth(6);
  }

  august() {
    this.setMonth(7);
  }

  september() {
    this.setMonth(8);
  }

  october() {
    this.setMonth(9);
  }

  november() {
    this.setMonth(10);
  }

  december() {
    this.setMonth(11);
  }

}
