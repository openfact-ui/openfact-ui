import { CLARKSNUT_API_URL } from '../../ngx/ngx-clarksnut';
import { KeycloakService } from './../../keycloak-service/keycloak.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter, Output, ViewChild, TemplateRef, Inject } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';

import {
  WizardComponent,
  WizardConfig,
  WizardStep,
  WizardStepConfig,
  WizardStepComponent,
  WizardEvent
} from 'patternfly-ng/wizard';

import {
  UploaderOptions,
  UploadOutput,
  UploadInput,
  UploadFile,
  UploadStatus,
  humanizeBytes
} from 'ngx-uploader';

import { Notifications } from '../../ngx/ngx-base';

@Component({
  selector: 'cn-import-document',
  templateUrl: './import-document.component.html',
  styleUrls: ['./import-document.component.scss']
})
export class ImportDocumentComponent implements OnInit {

  @Output('onFinish') onCreated = new EventEmitter();
  @ViewChild('wizardTemplate') wizardTemplate: TemplateRef<any>;

  // Wizard Step 1
  step1Config: WizardStepConfig;
  step1aConfig: WizardStepConfig;

  // Wizard Step 2
  step2Config: WizardStepConfig;
  step2aConfig: WizardStepConfig;

  // Wizard
  wizardConfig: WizardConfig;

  // Modal
  private modalRef: BsModalRef;

  // Upload
  uploadFiles: UploadFile[];
  uploadInput: EventEmitter<UploadInput>;
  uploadOptions: UploaderOptions;
  humanizeBytes: Function;

  filesUploading: UploadFile[] = [];
  filesDone: UploadFile[] = [];
  filesCancelled: UploadFile[] = [];

  private documentsUrl: string;

  constructor(
    private keycloakService: KeycloakService,
    private modalService: BsModalService,
    private notifications: Notifications,
    private translateService: TranslateService,
    @Inject(CLARKSNUT_API_URL) apiUrl: string) {
    this.uploadFiles = [];
    this.uploadInput = new EventEmitter<UploadInput>();
    this.uploadOptions = {
      concurrency: 2,
      allowedContentTypes: ['text/xml', 'application/zip', 'application/gzip']
    };
    this.humanizeBytes = humanizeBytes;

    this.documentsUrl = apiUrl.endsWith('/') ? apiUrl + 'documents' : apiUrl + '/documents';
  }

  ngOnInit() {
    this.initWizard();
  }

  updateFilesForm(): void {
    this.step1aConfig.nextEnabled = this.uploadFiles.length > 0;
    this.setNavAway(this.step1aConfig.nextEnabled);
  }

  clearData() {
    this.uploadFiles = [];
    this.filesUploading = [];
    this.filesDone = [];
    this.filesCancelled = [];
  }

  // Wizard
  initWizard() {
    // Step 1
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'Files'
    } as WizardStepConfig;
    this.step1aConfig = {
      id: 'step1a',
      expandReviewDetails: false,
      nextEnabled: false,
      priority: 0,
      title: 'Details'
    } as WizardStepConfig;

    // Step 2
    this.step2Config = {
      id: 'step2',
      priority: 1,
      title: 'Upload'
    } as WizardStepConfig;
    this.step2aConfig = {
      id: 'step2a',
      nextEnabled: false,
      priority: 0,
      title: 'Details'
    } as WizardStepConfig;

    // Wizard
    this.wizardConfig = {
      title: 'Import File',
      sidebarStyleClass: 'cn-wizard-sidebar',
      stepStyleClass: 'cn-wizard-step',
      hideSidebar: true
    } as WizardConfig;

    this.setNavAway(false);
  }

  // Wizard Methods
  nextClicked($event: WizardEvent): void {
    if ($event.step.config.id === 'step2a') {
      this.close();
    }
  }

  stepChanged($event: WizardEvent, wizard: WizardComponent) {
    const flatSteps = this.flattenWizardSteps(wizard);
    const currentStep = flatSteps.filter(step => step.config.id === $event.step.config.id);
    if (currentStep && currentStep.length > 0) {
      currentStep[0].config.nextEnabled = true;
    }
    if ($event.step.config.id === 'step1a') {
      this.updateFilesForm();
      this.wizardConfig.nextTitle = 'Upload';
    } else if ($event.step.config.id === 'step2a') {
      this.wizardConfig.nextTitle = 'Close';
    } else {
      this.wizardConfig.nextTitle = 'Next >';
    }
  }

  private setNavAway(allow: boolean) {
    this.step1Config.allowClickNav = allow;
    this.step1aConfig.allowClickNav = allow;

    this.step2Config.allowClickNav = allow;
    this.step2aConfig.allowClickNav = allow;
  }

  private flattenWizardSteps(wizard: WizardComponent): WizardStep[] {
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
    this.initWizard();
    this.clearData();
    this.modalRef.hide();
  }

  // Upload
  onUploadOutput(output: UploadOutput) {
    if (output.type === 'allAddedToQueue') {
      console.log('All files added to queue');
    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
      this.uploadFiles.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      const index = this.uploadFiles.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.uploadFiles[index] = output.file;
    } else if (output.type === 'removed') {
      this.uploadFiles = this.uploadFiles.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'removedAll') {
      this.uploadFiles = [];
    } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
      console.log(output.file.name + ' rejected');
    }

    this.updateFilesForm();

    this.filesUploading = this.uploadFiles.filter(file => file.progress.status === UploadStatus.Uploading);
    this.filesDone = this.uploadFiles.filter(file => file.progress.status === UploadStatus.Done);
    this.filesCancelled = this.uploadFiles.filter(file => file.progress.status === UploadStatus.Cancelled);
  }

  startUpload(): void {
    const tokenPromise: Promise<string> = this.keycloakService.getToken();
    const tokenObservable: Observable<string> = Observable.fromPromise(tokenPromise);
    tokenObservable.subscribe(token => {
      const event: UploadInput = {
        type: 'uploadAll',
        url: this.documentsUrl,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      };
      this.uploadInput.emit(event);
    });

    this.wizardConfig.done = true;
  }

  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }

}
