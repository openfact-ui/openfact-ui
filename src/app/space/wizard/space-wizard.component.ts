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

import { Observable } from 'rxjs/Observable';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import {
  WizardConfig,
  WizardComponent,
  WizardEvent,
  WizardStepConfig,
  WizardStep,
  WizardStepComponent
} from 'patternfly-ng/wizard';

import { SpacesService } from '../../ngx-impl/ngx-clarksnut-impl/spaces.service';
import { UserService } from '../../ngx/ngx-login-client';
import { ILoggerDelegate } from './common/logger';
import { ISpaceForm } from './models/spaceForm';
import { IRequestAccessForm } from './models/request-access';

import {
  Space,
  SpaceAttributes,
  SpaceService,
  SpaceNamePipe,
  SpaceRelatedLink,
  RequestAccessService,
  RequestAccessToSpace
} from '../../ngx/ngx-clarksnut';
import { Broadcaster, Notification, NotificationAction, Notifications, NotificationType } from '../../ngx/ngx-base';

@Component({
  selector: 'cn-space-wizard',
  templateUrl: './space-wizard.component.html',
  styleUrls: ['./space-wizard.component.scss'],
})
export class SpaceWizardComponent implements OnInit {

  @Output('onCreated') onCreated = new EventEmitter();
  @ViewChild('wizardTemplate') wizardTemplate: TemplateRef<any>;

  space: Space; // Space to be created
  previousSpace: Space; // Previous space
  termsAndConditions: boolean = false;
  requestAccess: IRequestAccessForm;
  working: boolean = false;
  success: boolean = false;

  // Wizard
  wizardConfig: WizardConfig;

  // Wizard Step 1
  step1Config: WizardStepConfig;
  step1aConfig: WizardStepConfig;
  step1bConfig: WizardStepConfig;

  // Wizard Step 2
  step2Config: WizardStepConfig;
  step2aConfig: WizardStepConfig;
  step2bConfig: WizardStepConfig;

  // Modal
  private modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private userService: UserService,
    private spaceService: SpaceService,
    private spacesService: SpacesService,
    private spaceNamePipe: SpaceNamePipe,
    private requestAccessService: RequestAccessService,
    private broadcaster: Broadcaster,
    private notifications: Notifications,
    private translateService: TranslateService) { }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

  ngOnInit() {
    this.initWizard();
    //this.translateWizard();
  }

  initWizard() {
    // Step 1
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'Space'
    } as WizardStepConfig;
    this.step1aConfig = {
      id: 'step1a',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 0,
      title: 'Details'
    } as WizardStepConfig;
    this.step1bConfig = {
      id: 'step1b',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Settings'
    } as WizardStepConfig;

    // Step 2
    this.step2Config = {
      id: 'step2',
      priority: 1,
      title: 'Review'
    } as WizardStepConfig;
    this.step2aConfig = {
      id: 'step2a',
      nextEnabled: false,
      priority: 0,
      title: 'Summary'
    } as WizardStepConfig;
    this.step2bConfig = {
      id: 'step2b',
      nextEnabled: false,
      priority: 1,
      title: 'Save'
    } as WizardStepConfig;

    // Wizard
    this.wizardConfig = {
      title: 'Create Space',
      sidebarStyleClass: 'cn-wizard-sidebar',
      stepStyleClass: 'cn-wizard-step'
    } as WizardConfig;

    this.setNavAway(false);
  }

  translateWizard() {
    // Title
    this.translateService.get('SPACE_WIZARD.TITLE').take(1).subscribe((val) => {
      this.wizardConfig.title = val;
    });

    // Footer buttons
    this.translateService.get('BUTTONS.CANCEL').take(1).subscribe((val) => {
      this.wizardConfig.cancelTitle = val;
    });
    this.translateService.get('BUTTONS.BACK').take(1).subscribe((val) => {
      this.wizardConfig.previousTitle = '< ' + val;
    });
    this.translateService.get('BUTTONS.NEXT').take(1).subscribe((val) => {
      this.wizardConfig.nextTitle = val + '>';
    });

    // Step headers
    this.translateService.get('SPACE_WIZARD.SPACE').take(1).subscribe((val) => {
      this.step1Config.title = val;
    });
    this.translateService.get('SPACE_WIZARD.REVIEW').take(1).subscribe((val) => {
      this.step2Config.title = val;
    });

    // Step 1
    this.translateService.get('SPACE_WIZARD.DETAILS').take(1).subscribe((val) => {
      this.step1aConfig.title = val;
    });
    this.translateService.get('SPACE_WIZARD.SETTINGS').take(1).subscribe((val) => {
      this.step1bConfig.title = val;
    });

    // Step 2
    this.translateService.get('SPACE_WIZARD.SUMMARY').take(1).subscribe((val) => {
      this.step2aConfig.title = val;
    });
    this.translateService.get('SPACE_WIZARD.CREATE').take(1).subscribe((val) => {
      this.step2bConfig.title = val;
    });
  }

  // Wizard Methods
  nextClicked($event: WizardEvent): void {
    if ($event.step.config.id == 'step1a') {
      this.spaceService.getSpaceByAssignedId(this.space.attributes.assignedId).subscribe((val) => {
        this.previousSpace = val;

        if (this.previousSpace) {
          this.translateService.get('SPACE_WIZARD.REQUEST_ACCESS').take(1).subscribe((val) => {
            this.step1bConfig.title = val;
          });
        } else {
          this.translateService.get('SPACE_WIZARD.TERMS_AND_CONDITIONS').take(1).subscribe((val) => {
            this.step1bConfig.title = val;
          });
        }
      });
    }
    if ($event.step.config.id === 'step2b') {
      this.close();
    }
  }

  stepChanged($event: WizardEvent, wizard: WizardComponent) {
    let flatSteps = this.flattenWizardSteps(wizard);
    let currentStep = flatSteps.find(step => step.config.id === $event.step.config.id);
    if (currentStep) {
      currentStep.config.nextEnabled = true;
    }

    if ($event.step.config.id === 'step1a') {
      this.step1aConfig.nextEnabled = (this.space !== undefined && this.space !== null);
      this.setNavAway(this.step1aConfig.nextEnabled);
      this.translateService.get('BUTTONS.NEXT').take(1).subscribe((val) => {
        this.wizardConfig.nextTitle = val + ' >';
      });
    } else if ($event.step.config.id === 'step1b') {
      this.step1bConfig.nextEnabled = this.termsAndConditions;
      this.setNavAway(this.step1bConfig.nextEnabled);
      this.translateService.get('BUTTONS.NEXT').take(1).subscribe((val) => {
        this.wizardConfig.nextTitle = val + ' >';
      });
    } else if ($event.step.config.id === 'step2a') {
      this.wizardConfig.nextTitle = 'Create';
      if (!this.previousSpace) {
        this.translateService.get('BUTTONS.CREATE').take(1).subscribe((val) => {
          this.wizardConfig.nextTitle = val;
        });
      } else {
        this.translateService.get('BUTTONS.REQUEST_ACCESS').take(1).subscribe((val) => {
          this.wizardConfig.nextTitle = val;
        });
      }
    } else if ($event.step.config.id === 'step2b') {
      this.wizardConfig.nextTitle = 'Close';
      this.translateService.get('BUTTONS.CLOSE').take(1).subscribe((val) => {
        this.wizardConfig.nextTitle = val;
      });
    } else {
      this.wizardConfig.nextTitle = 'Next >';
    }
  }

  private setNavAway(allow: boolean) {
    this.step1aConfig.allowNavAway = allow;
    this.step2aConfig.allowNavAway = allow;

    this.step1Config.allowClickNav = allow;
    this.step1aConfig.allowClickNav = allow;
    this.step1bConfig.allowClickNav = allow;

    this.step2Config.allowClickNav = allow;
    this.step2aConfig.allowClickNav = allow;
    this.step2bConfig.allowClickNav = allow;
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

  // On Steps form change
  onSpaceFormChange($event: ISpaceForm) {
    if ($event) {
      this.space = this.createTransientSpace();
      this.space.attributes.name = $event.name;
      this.space.attributes.assignedId = $event.assignedId;
      this.space.attributes.description = $event.description;
    } else {
      this.space = null;
    }

    this.step1aConfig.nextEnabled = $event ? true : false;
    this.setNavAway(this.step1aConfig.nextEnabled);
  }

  onTermsConditionsChange($event: boolean) {
    this.termsAndConditions = $event;

    this.step1bConfig.nextEnabled = $event;
    this.setNavAway(this.step1bConfig.nextEnabled);
  }

  onRequestAccessChange($event: IRequestAccessForm) {
    this.requestAccess = $event;

    this.step1bConfig.nextEnabled = $event ? true : false;
    this.setNavAway(this.step1bConfig.nextEnabled);
  }

  // Actions

  save(): void {
    this.working = true;
    this.wizardConfig.done = true;

    if (this.previousSpace) {
      let request: RequestAccessToSpace = {
        attributes: {
          scope: 'COLLABORATOR_ACCESS',
          message: this.requestAccess.message
        }
      } as RequestAccessToSpace;
      this.requestAccessService.addRequestAccess(this.previousSpace.id, request).subscribe(
        (createdSpace) => {
          this.notifications.message(<Notification>{
            message: `Your request has been sent!`,
            type: NotificationType.SUCCESS
          });
          this.finish(true);
        },
        (err) => {
          this.notifications.message(<Notification>{
            message: `Error sending request"`,
            type: NotificationType.DANGER
          });
          this.finish(false);
        });
    } else {
      // Saving
      console.log('Creating space', this.space);
      this.space.attributes.name = this.space.attributes.name.replace(/ /g, '_');

      this.userService.loggedInUser
        .switchMap((user) => {
          this.space.relationships.ownedBy[0].data.id = user.id;
          return this.spaceService.create(this.space);
        })
        .do((createdSpace) => {
          this.spacesService.addRecent.next(createdSpace);
        })
        .subscribe((createdSpace) => {
          this.notifications.message(<Notification>{
            message: `Your new space is created!`,
            type: NotificationType.SUCCESS
          });
          this.finish(true, createdSpace);
          this.broadcaster.broadcast('spaceCreated', createdSpace);
        },
        (err) => {
          console.log('Error creating space', err);
          if (err.status == 409) {
            this.notifications.message(<Notification>{
              message: `Space ${this.space.attributes.assignedId} has already been registered by another user`,
              type: NotificationType.DANGER
            });
          } else {
            this.notifications.message(<Notification>{
              message: `Space could not been created"`,
              type: NotificationType.DANGER
            });
          }
          this.finish(false);
        });
    }
  }

  private createTransientSpace(): Space {
    let space = {} as Space;
    space.attributes = new SpaceAttributes();
    space.attributes.name = space.name;
    space.type = 'spaces';
    space.relationships = {
      collaborators: {} as SpaceRelatedLink,
      ownedBy: [
        {
          data: {
            id: '',
            type: 'identities'
          }
        }
      ]
    };
    return space;
  }

  finish(success: boolean, createdSpace?: Space) {
    console.log(`finish ...`);
    this.working = false;
    this.success = success;
    if (createdSpace) {
      this.onCreated.emit(createdSpace);
    }
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
    this.close();
  }

  close() {
    // clear wizard
    this.initWizard();
    this.space = null;
    this.termsAndConditions = false;
    this.previousSpace = null;
    this.requestAccess = null;

    this.modalRef.hide();
  }

}
