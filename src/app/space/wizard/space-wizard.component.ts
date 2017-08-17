import { Subscription } from 'rxjs/Subscription';

import {
    Component,
    Input,
    Output,
    OnInit,
    OnDestroy,
    ViewChild,
    ViewEncapsulation,
    TemplateRef,
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
    WizardStepConfig
} from 'patternfly-ng';

import { TabDirective } from 'ngx-bootstrap/tabs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'ofs-space-wizard',
    templateUrl: './space-wizard.component.html',
    styleUrls: ['./space-wizard.component.scss'],
})
export class SpaceWizardComponent implements OnInit, OnDestroy {

    @ViewChild('wizardTemplate')
    public wizardTemplate: TemplateRef<any>;

    public form: FormGroup;

    // Wizard Step 1
    public step1Config: WizardStepConfig;
    public step1aConfig: WizardStepConfig;

    // Wizard Step 2
    public step2Config: WizardStepConfig;
    public step2aConfig: WizardStepConfig;
    public step2bConfig: WizardStepConfig;

    // Wizard
    public wizardConfig: WizardConfig;

    // Modal
    private modalRef: BsModalRef;

    private subscriptions: Subscription[] = [];

    constructor(
        private modalService: BsModalService,
        private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            space: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
            alias: [null, Validators.compose([Validators.maxLength(250)])],
        });
    }

    public ngOnInit() {
        // Step 1
        this.step1Config = {
            id: 'step1',
            priority: 0,
            title: 'Space Info'
        } as WizardStepConfig;

        this.step1aConfig = {
            id: 'step1a',
            expandReviewDetails: true,
            nextEnabled: false,
            priority: 0,
            title: 'Details'
        } as WizardStepConfig;

        // Step 2
        this.step2Config = {
            id: 'step2',
            priority: 1,
            title: 'Review'
        } as WizardStepConfig;

        this.step2aConfig = {
            id: 'step2a',
            priority: 0,
            title: 'Summary'
        } as WizardStepConfig;

        this.step2bConfig = {
            id: 'step2b',
            priority: 1,
            title: 'Deploy'
        } as WizardStepConfig;

        // Wizard
        this.wizardConfig = {
            loadingTitle: 'Loading',
            loadingSecondaryInfo: 'Please wait.',
            title: 'Claim Space',
        } as WizardConfig;

        this.setNavAway(false);

        // Watch changes
        this.subscriptions.push(this.form.statusChanges.subscribe((value) => {
            this.step1aConfig.nextEnabled = (value === 'VALID');
            this.setNavAway(this.step1aConfig.nextEnabled);
            console.log(value);
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    /**
     * Open modal
     * @param options
     */
    public open(options?: any) {
        this.wizardConfig.done = false;

        this.form.patchValue({
            space: null,
            alias: null
        });
        this.form.markAsPristine();

        const defaultOptions = { class: 'modal-lg' };
        this.modalRef = this.modalService.show(this.wizardTemplate, options || defaultOptions);
    }

    /**
     * Close modal
     */
    public close() {
        this.modalRef.hide();
    }

    public nextClicked($event: WizardEvent) {
        console.log($event);
        if ($event.step.config.id === 'step2b') {
            this.close();
        }
    }

    public stepChanged($event: WizardEvent) {
        if ($event.step.config.id === 'step1a') {
            this.setNavAway(false);
        } else if ($event.step.config.id === 'step2a') {
            this.wizardConfig.nextTitle = 'Deploy';
        } else if ($event.step.config.id === 'step2b') {
            this.wizardConfig.nextTitle = 'Close';
        } else {
            this.wizardConfig.nextTitle = 'Next >';
        }
    }

    public startDeploy() {
        this.wizardConfig.done = true;

        // Simulate a delay
        setTimeout(() => {
            console.log('complete');
        }, 2500);
    }

    private setNavAway(allow: boolean) {
        this.step1aConfig.allowNavAway = allow;

        this.step1Config.allowClickNav = allow;
        this.step1aConfig.allowClickNav = allow;

        this.step2Config.allowClickNav = allow;
        this.step2aConfig.allowClickNav = allow;
        this.step2bConfig.allowClickNav = allow;
    }
}