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
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
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

import {
  Space,
  SpaceAttributes,
  SpaceService,
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

  @Output() created = new EventEmitter();
  @ViewChild('wizardTemplate') wizardTemplate: TemplateRef<any>;

  space: Space; // Space to be created
  previousSpace: Space; // Previous space
  termsAndConditions = false;
  requestAccess: RequestAccessToSpace;
  working = false;
  success = false;

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
    private requestAccessService: RequestAccessService,
    private broadcaster: Broadcaster,
    private notifications: Notifications) { }

  /**
   * used to add a log entry to the logger
   * The default one shown here does nothing.
   */
  log: ILoggerDelegate = () => { };

  ngOnInit() {
    this.initWizard();
  }

  initWizard() {
    // Step 1
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'Espacio'
    } as WizardStepConfig;
    this.step1aConfig = {
      id: 'step1a',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 0,
      title: 'Detalle'
    } as WizardStepConfig;
    this.step1bConfig = {
      id: 'step1b',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Configuración'
    } as WizardStepConfig;

    // Step 2
    this.step2Config = {
      id: 'step2',
      priority: 1,
      title: 'Revision'
    } as WizardStepConfig;
    this.step2aConfig = {
      id: 'step2a',
      nextEnabled: false,
      priority: 0,
      title: 'Resumen'
    } as WizardStepConfig;
    this.step2bConfig = {
      id: 'step2b',
      nextEnabled: false,
      priority: 1,
      title: 'Guardar'
    } as WizardStepConfig;

    // Wizard
    this.wizardConfig = {
      title: 'Crear Espacio',
      sidebarStyleClass: 'cn-wizard-sidebar',
      stepStyleClass: 'cn-wizard-step',
      cancelTitle: 'Cancelar',
      previousTitle: '< Anterior'
    } as WizardConfig;

    this.setNavAway(false);
  }

  // Wizard Methods
  nextClicked($event: WizardEvent): void {
    if ($event.step.config.id === 'step1a') {
      this.spaceService.getSpaceByAssignedId(this.space.attributes.assignedId).subscribe((space) => {
        this.previousSpace = space;
        if (this.previousSpace) {
          this.step1bConfig.title = 'Solicitar Acceso';
        } else {
          this.step1bConfig.title = 'Términos ys condiciones';
        }
      });
    }
    if ($event.step.config.id === 'step2b') {
      this.close();
    }
  }

  stepChanged($event: WizardEvent, wizard: WizardComponent) {
    const flatSteps = this.flattenWizardSteps(wizard);
    const currentStep = flatSteps.find(step => step.config.id === $event.step.config.id);
    if (currentStep) {
      currentStep.config.nextEnabled = true;
    }

    if ($event.step.config.id === 'step1a') {
      this.step1aConfig.nextEnabled = (this.space !== undefined && this.space !== null);
      this.setNavAway(this.step1aConfig.nextEnabled);
      this.wizardConfig.nextTitle = 'Siguiente >';
    } else if ($event.step.config.id === 'step1b') {
      this.step1bConfig.nextEnabled = this.termsAndConditions;
      this.setNavAway(this.step1bConfig.nextEnabled);
      this.wizardConfig.nextTitle = 'Siguiente >';
    } else if ($event.step.config.id === 'step2a') {
      this.wizardConfig.nextTitle = 'Create';
      if (this.previousSpace) {
        this.wizardConfig.nextTitle = 'Solicitar Acceso';
      } else {
        this.wizardConfig.nextTitle = 'Crear';
      }
    } else if ($event.step.config.id === 'step2b') {
      this.wizardConfig.nextTitle = 'Cerrar';
    } else {
      this.wizardConfig.nextTitle = 'Siguiente >';
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
    const flatWizard: WizardStep[] = [];
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
  onSpaceFormChange($event: Space) {
    this.space = $event;

    this.step1aConfig.nextEnabled = $event ? true : false;
    this.setNavAway(this.step1aConfig.nextEnabled);
  }

  onTermsConditionsChange($event: boolean) {
    this.termsAndConditions = $event;

    this.step1bConfig.nextEnabled = $event;
    this.setNavAway(this.step1bConfig.nextEnabled);
  }

  onRequestAccessChange($event: RequestAccessToSpace) {
    this.requestAccess = $event;

    this.step1bConfig.nextEnabled = $event ? true : false;
    this.setNavAway(this.step1bConfig.nextEnabled);
  }

  // Actions

  save(): void {
    if (!this.previousSpace) {
      this.saveSpace();
    } else {
      this.saveRequestAccess();
    }
  }

  saveSpace() {
    this.working = true;
    this.wizardConfig.done = true;

    // Saving
    console.log('Creating space', this.space);
    this.space.attributes.name = this.space.attributes.name.replace(/ /g, '_');

    this.userService.loggedInUser
      .switchMap((user) => {
        this.space.relationships.ownedBy.data.id = user.id;
        return this.spaceService.create(this.space);
      })
      .do((createdSpace) => {
        this.spacesService.addRecent.next(createdSpace);
      })
      .subscribe((createdSpace) => {
        this.notifications.message(<Notification>{
          message: `Tu Nuevo Espacio fue creado!`,
          type: NotificationType.SUCCESS
        });
        this.finish(true, createdSpace);
        this.broadcaster.broadcast('spaceCreated', createdSpace);
      },
        (err) => {
          console.log('Error creating space', err);
          if (err.status === 409) {
            this.notifications.message(<Notification>{
              message: `El Espacio ${this.space.attributes.assignedId} ya fue reclamado por otro usuario`,
              type: NotificationType.DANGER
            });
          } else {
            this.notifications.message(<Notification>{
              message: `El Espacio no pudo ser creado, inténtelo nuevamente`,
              type: NotificationType.DANGER
            });
          }
          this.finish(false);
        });
  }

  saveRequestAccess() {
    this.working = true;
    this.wizardConfig.done = true;

    this.requestAccessService.addRequestAccess(this.requestAccess).subscribe(
      (createdSpace) => {
        this.notifications.message(<Notification>{
          message: `Tu Solicitud fue enviada!`,
          type: NotificationType.SUCCESS
        });
        this.finish(true);
      },
      (err: HttpErrorResponse) => {
        console.log(err);
        if (err.status === 409) {
          this.notifications.message(<Notification>{
            message: `Ya eres parte del Espacio, no puedes solicitar acceso.`,
            type: NotificationType.INFO
          });
        } else {
          this.notifications.message(<Notification>{
            message: `No se puso enviar tu solicitud, inténtelo nuevamente.`,
            type: NotificationType.DANGER
          });
        }
        this.finish(false);
      });
  }

  finish(success: boolean, createdSpace?: Space) {
    console.log(`finish ...`);
    this.working = false;
    this.success = success;
    if (createdSpace) {
      this.created.emit(createdSpace);
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
