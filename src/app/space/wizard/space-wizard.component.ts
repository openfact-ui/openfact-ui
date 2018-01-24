import { Router } from '@angular/router';
import { SpacesService } from '../../ngx-clarksnut-impl/spaces.service';
import { UserService } from '../../ngx-login-client';
import { ILoggerDelegate } from './common/logger';
import { ISpaceForm } from './models/spaceForm';

import {
  Space,
  SpaceAttributes,
  SpaceService,
  SpaceNamePipe,
  SpaceRelatedLink
} from '../../ngx-clarksnut';

import {
  Component,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  TemplateRef,
  EventEmitter,
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  WizardConfig,
  WizardComponent,
  WizardEvent,
  WizardStepConfig,
  WizardStep,
  WizardStepComponent
} from 'patternfly-ng/wizard';

import { Notification, NotificationAction, Notifications, NotificationType } from '../../ngx-base';

import { TabDirective } from 'ngx-bootstrap/tabs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ofs-space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss'],
})
export class SpaceWizardComponent implements OnInit {

  @Output('onSaved') onSaved = new EventEmitter();
  @Output('onCancel') onCancel = new EventEmitter();

  @ViewChild('wizardTemplate') wizardTemplate: TemplateRef<any>;

  space: Space;
  termsAndConditions: boolean;
  working: boolean = false;

  // Wizard
  public wizardConfig: WizardConfig;

  // Wizard Step 1
  public stepSpaceConfig: WizardStepConfig;
  public stepSpaceTermsConditionsConfig: WizardStepConfig;
  public stepSpaceInfoConfig: WizardStepConfig;

  // Wizard Step 2
  public stepClaimConfig: WizardStepConfig;
  public stepClaimReviewConfig: WizardStepConfig;
  public stepClaimResultConfig: WizardStepConfig;

  // Modal
  private modalRef: BsModalRef;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private spaceService: SpaceService,
    private spacesService: SpacesService,
    private spaceNamePipe: SpaceNamePipe,
    private notifications: Notifications) { }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  public log: ILoggerDelegate = () => { };

  ngOnInit() {
    this.initWizard();
  }

  initWizard() {
    // Step Space
    this.stepSpaceConfig = {
      id: 'stepSpace',
      priority: 0,
      title: 'Space'
    } as WizardStepConfig;

    this.stepSpaceInfoConfig = {
      id: 'stepSpaceInfo',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 0,
      title: 'Space Data'
    } as WizardStepConfig;

    this.stepSpaceTermsConditionsConfig = {
      id: 'stepSpaceTermsConditions',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Terms & Conditions'
    } as WizardStepConfig;

    // Step 2
    this.stepClaimConfig = {
      id: 'stepClaim',
      priority: 1,
      title: 'Review'
    } as WizardStepConfig;
    this.stepClaimReviewConfig = {
      id: 'stepClaimReview',
      nextEnabled: false,
      priority: 0,
      title: 'Summary'
    } as WizardStepConfig;
    this.stepClaimResultConfig = {
      id: 'stepClaimResult',
      nextEnabled: false,
      priority: 1,
      title: 'Claim'
    } as WizardStepConfig;

    // Wizard
    this.wizardConfig = {
      title: 'Claim Space'
    } as WizardConfig;

    this.setNavAway(false);
  }

  // Methods
  nextClicked($event: WizardEvent): void {
    if ($event.step.config.id === 'stepClaimResult') {
      this.close();
    }
  }

  public stepChanged($event: WizardEvent, wizard: WizardComponent) {
    let flatSteps = this.flattenWizardSteps(wizard);
    let currentStep = flatSteps.find(step => step.config.id === $event.step.config.id);

    if (currentStep) {
      currentStep.config.nextEnabled = true;
    }
    if ($event.step.config.id === 'stepSpaceInfo') {
      this.stepSpaceInfoConfig.nextEnabled = (this.space !== undefined && this.space !== null);
      this.setNavAway(this.stepSpaceInfoConfig.nextEnabled);
    } else if ($event.step.config.id === 'stepSpaceTermsConditions') {
      this.stepSpaceTermsConditionsConfig.nextEnabled = this.termsAndConditions;
      this.setNavAway(this.stepSpaceTermsConditionsConfig.nextEnabled);
    } else if ($event.step.config.id === 'stepClaimReview') {
      this.wizardConfig.nextTitle = 'Claim';
    } else if ($event.step.config.id === 'stepClaimResult') {
      this.wizardConfig.nextTitle = 'Close';
    } else {
      this.wizardConfig.nextTitle = 'Next >';
    }
  }

  private setNavAway(allow: boolean) {
    this.stepSpaceInfoConfig.allowNavAway = allow;
    this.stepClaimReviewConfig.allowNavAway = allow;

    this.stepSpaceConfig.allowClickNav = allow;
    this.stepSpaceInfoConfig.allowClickNav = allow;
    this.stepSpaceTermsConditionsConfig.allowClickNav = allow;

    this.stepClaimConfig.allowClickNav = allow;
    this.stepClaimReviewConfig.allowClickNav = allow;
    this.stepClaimResultConfig.allowClickNav = allow;
  }

  flattenWizardSteps(wizard: WizardComponent): WizardStep[] {
    let flatWizard: WizardStep[] = [];
    wizard.steps.forEach((step: WizardStepComponent) => {
      if (step.hasSubsteps) {
        step.steps.forEach(substep => {
          flatWizard.push(substep);
        });
      } else {
        flatWizard.push(step);
      }
    });
    return flatWizard;
  }

  //

  onSpaceFormChange($event: ISpaceForm) {
    if ($event) {
      this.space = this.createTransientSpace();
      this.space.attributes.name = $event.name;
      this.space.attributes.assignedId = $event.assignedId;
      this.space.attributes.description = $event.description;
    } else {
      this.space = null;
    }

    this.stepSpaceInfoConfig.nextEnabled = $event ? true : false;
    this.setNavAway(this.stepSpaceInfoConfig.nextEnabled);
  }

  onTermsConditionsChange($event: boolean) {
    this.termsAndConditions = $event;

    this.stepSpaceTermsConditionsConfig.nextEnabled = $event;
    this.setNavAway(this.stepSpaceTermsConditionsConfig.nextEnabled);
  }

  // Actions

  save(): void {
    this.working = true;
    this.wizardConfig.done = true;

    // Saving
    console.log('Creating space', this.space);
    this.space.attributes.name = this.space.attributes.name.replace(/ /g, '_');

    this.userService.loggedInUser
      .switchMap((user) => {
        this.space.relationships['owned-by'].data.id = user.id;
        return this.spaceService.create(this.space);
      })
      .do((createdSpace) => {
        this.spacesService.addRecent.next(createdSpace);
      })
      .subscribe((createdSpace) => {
        const primaryAction: NotificationAction = {
          name: `Open Space`,
          title: `Open ${this.spaceNamePipe.transform(createdSpace.attributes.name)}`,
          id: 'openSpace'
        };
        this.notifications.message(<Notification>{
          message: `Your new space is created!`,
          type: NotificationType.SUCCESS,
          primaryAction: primaryAction
        })
          .filter(action => action.id === primaryAction.id)
          .subscribe(action => {
            this.router.navigate([createdSpace.relationalData.creator.attributes.username,
            createdSpace.attributes.assignedId]);
            this.finish();
          });
        this.router.navigate([createdSpace.relationalData.creator.attributes.username, createdSpace.attributes.assignedId]);
        this.finish();
      },
      (err) => {
        console.log('Error creating space', err);
        this.notifications.message(<Notification>{
          message: `Failed to create "${this.space.attributes.name}"`,
          type: NotificationType.DANGER
        });
        this.finish();
      });
  }

  private createTransientSpace(): Space {
    let space = {} as Space;
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.relationships = {
      collaborators: {} as SpaceRelatedLink,
      ['owned-by']: {
        data: {
          id: '',
          type: 'identities'
        }
      }
    };
    return space;
  }

  finish() {
    console.log(`finish ...`);
    this.working = false;
    this.onSaved.emit({ flow: 'selectFlow', space: this.space.attributes.name });
  }

  // Modal
  open() {
    const defaultOptions = {
      class: 'modal-lg',
      keyboard: false,
      ignoreBackdropClick: true
    };
    this.modalRef = this.modalService.show(this.wizardTemplate, defaultOptions);
  }

  cancel() {
    this.onCancel.emit({});
    this.close();
  }

  close() {
    // clear wizard
    this.initWizard();
    this.space = null;
    this.termsAndConditions = false;

    this.modalRef.hide();
  }

}
