import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Notification, NotificationType, Notifications } from '../../ngx/ngx-base';
import { Context, Contexts } from '../../ngx/ngx-clarksnut';
import { AuthenticationService, UserService, User } from '../../ngx/ngx-login-client';

import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';

import { OfValidators } from '../validators/ofs-validators';

@Component({
  selector: 'ofs-update',
  templateUrl: 'update.component.html',
  styleUrls: ['./update.component.scss'],
  providers: [GettingStartedService]
})
export class UpdateComponent implements AfterViewInit, OnInit {

  @ViewChild('_email') public emailElement: ElementRef;
  @ViewChild('_bio') public bioElement: HTMLElement;
  @ViewChild('_imageUrl') public imageUrlElement: ElementRef;
  @ViewChild('_url') public urlElement: ElementRef;

  public isUpdateProfileDisabled: boolean;

  public form: FormGroup;
  public context: Context;
  public loggedInUser: User;

  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private gettingStartedService: GettingStartedService,
    private contexts: Contexts,
    private notifications: Notifications,
    private renderer: Renderer2,
    private router: Router,
    private userService: UserService) {
    this.form = this.formBuilder.group({
      fullName: [null, Validators.compose([Validators.maxLength(120)])],
      email: [null, Validators.compose([Validators.required, Validators.maxLength(90), OfValidators.email()])],
      company: [null, Validators.compose([Validators.maxLength(120)])],
      imageURL: [null, Validators.compose([Validators.maxLength(250), OfValidators.url()])],
      url: [null, Validators.compose([Validators.maxLength(250), OfValidators.url()])],
      bio: [null, Validators.compose([Validators.maxLength(250)])],
    });

    this.subscriptions.push(contexts.current.subscribe((val) => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe((user) => {
      this.loggedInUser = user;
      this.setUserProperties(user);
    }));
  }

  ngAfterViewInit(): void {
    // Set focus
    if (this.getRequestParam('bio') !== null) {
      this.setElementFocus(null, this.bioElement);
    } else if (this.getRequestParam('email') !== null) {
      this.setElementFocus(null, this.emailElement.nativeElement);
    } else if (this.getRequestParam('imageUrl') !== null) {
      this.setElementFocus(null, this.imageUrlElement.nativeElement);
    } else if (this.getRequestParam('url') !== null) {
      this.setElementFocus(null, this.urlElement.nativeElement);
    }
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  // Actions

  public linkImageUrl(): void {

  }

  /**
   * Route to user profile
   */
  public routeToProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username]);
  }

  /**
   * Set element focus to given HTML elment
   *
   * @param $event The triggered event
   * @param element The component or HTML element to set focus
   */
  public setElementFocus($event: MouseEvent, element: any) {
    if (element instanceof HTMLElement) {
      (element as HTMLElement).focus();
    }
  }

  /**
   * Update user profile
   */
  public updateProfile(): void {
    let profile = this.getTransientProfile();

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe((user) => {
      this.setUserProperties(user);
      this.routeToProfile();
      this.notifications.message({
        message: `Profile updated!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, (error) => {
      if (error.status === 409) {
        this.handleError('Email already exists', NotificationType.DANGER);
      } else {
        this.handleError('Failed to update profile', NotificationType.DANGER);
      }
    }));
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    // tslint:disable-next-line:max-line-length
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param != null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  /**
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    delete profile.username;
    return Object.assign(profile, this.form.value);
  }

  /**
   * Set user properties
   *
   * @param user
   */
  private setUserProperties(user: User): void {
    if (user.attributes === undefined) {
      return;
    }

    this.form.patchValue({
      fullName: (user.attributes.fullName !== undefined) ? user.attributes.fullName : '',
      email: (user.attributes.email !== undefined) ? user.attributes.email : '',
      company: (user.attributes.company !== undefined) ? user.attributes.company : '',
      imageURL: (user.attributes.imageURL !== undefined) ? user.attributes.imageURL : '',
      url: (user.attributes.url !== undefined) ? user.attributes.url : '',
      bio: (user.attributes.bio !== undefined) ? user.attributes.bio : ''
    });
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

}
