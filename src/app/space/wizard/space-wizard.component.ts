import { SpacesService } from '../../shared/spaces.service';
import { UserService } from 'ngo-login-client';
import { ILoggerDelegate } from './common/logger';
import { ISpaceForm } from './models/spaceForm';

import {
    Space,
    SpaceAttributes,
    SpaceService,
    SpaceNamePipe,
    SpaceRelatedLink
} from 'ngo-openfact-sync';

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

import { NotificationService, Notification, NotificationType, Action } from 'patternfly-ng';

@Component({
    selector: 'ofs-space-wizard',
    templateUrl: './space-wizard.component.html',
    styleUrls: ['./space-wizard.component.scss'],
})
export class SpaceWizardComponent implements OnInit {

    @ViewChild('wizardTemplate')
    public wizardTemplate: TemplateRef<any>;

    public acceptTermsConditions = false;
    public spaceForm: ISpaceForm = null;

    public claimComplete: boolean = true;

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
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private spaceService: SpaceService,
        private spacesService: SpacesService,
        private spaceNamePipe: SpaceNamePipe,
        private notifications: NotificationService) { }

    /**
     * used to add a log entry to the logger
     * The default one shown here does nothing.
     */
    public log: ILoggerDelegate = () => { };

    public ngOnInit() {
        // Wizard
        this.wizardConfig = {
            title: 'Claim Space'
        } as WizardConfig;

        // Step Space
        this.stepSpaceConfig = {
            id: 'stepSpace',
            priority: 0,
            title: 'Space'
        } as WizardStepConfig;

        this.stepSpaceTermsConditionsConfig = {
            id: 'stepSpaceTermsConditions',
            expandReviewDetails: true,
            nextEnabled: false,
            allowNavAway: false,
            allowClickNav: false,
            priority: 0,
            title: 'Terms & Conditions'
        } as WizardStepConfig;
        this.stepSpaceInfoConfig = {
            id: 'stepSpaceInfo',
            expandReviewDetails: true,
            allowClickNav: false,
            priority: 1,
            title: 'Space Data'
        } as WizardStepConfig;

        // Step 3
        this.stepClaimConfig = {
            id: 'stepClaim',
            priority: 2,
            title: 'Review'
        } as WizardStepConfig;
        this.stepClaimReviewConfig = {
            id: 'stepClaimReview',
            priority: 0,
            title: 'Summary'
        } as WizardStepConfig;
        this.stepClaimResultConfig = {
            id: 'stepClaimResult',
            priority: 1,
            title: 'Claim'
        } as WizardStepConfig;
    }

    /**
     * Open modal
     * @param options
     */
    public open(options?: any) {
        this.wizardConfig.done = false;

        const defaultOptions = { class: 'modal-lg' };
        this.modalRef = this.modalService.show(this.wizardTemplate, options || defaultOptions);
    }

    /**
     * Close modal
     */
    public close() {
        this.modalRef.hide();
    }

    // Methods
    public nextClicked($event: WizardEvent): void {
        if ($event.step.config.id === 'stepClaimResult') {
            this.close();
        }
    }

    public stepChanged($event: WizardEvent) {
        if ($event.step.config.id === 'stepSpaceTermsConditions') {
            this.stepSpaceTermsConditionsRefresh();
        } else if ($event.step.config.id === 'stepSpaceInfo') {
            this.stepSpaceInfoRefresh();
        } else if ($event.step.config.id === 'stepClaimReview') {
            this.wizardConfig.nextTitle = 'Claim';
        } else if ($event.step.config.id === 'stepClaimResult') {
            this.wizardConfig.nextTitle = 'Close';
        } else {
            this.wizardConfig.nextTitle = 'Next >';
        }
    }

    public startClaim(): void {
        this.claimComplete = false;
        this.wizardConfig.done = true;

        // Simulate a delay
        setTimeout(() => {
            this.claimComplete = true;
        }, 2500);

        this.log(`createSpace ...`);
        let space = this.createTransientSpace();
        space.attributes.name = this.spaceForm.name;
        space.attributes.assignedId = this.spaceForm.assignedId;

        console.log('Creating space', space);
        this.userService.loggedInUser
            .switchMap((user) => {
                space.relationships['owned-by'].data.id = user.id;
                return this.spaceService.create(space);
            })
            .do((createdSpace) => {
                this.spacesService.addRecent.next(createdSpace);
            })
            .subscribe((createdSpace) => {
                // this.configurator.currentSpace = createdSpace;
                const primaryAction: Action = {
                    id: 'openSpace',
                    tooltip: `Open Space`,
                    title: `Open ${this.spaceNamePipe.transform(createdSpace.attributes.name)}`,
                };

                this.notifications.message(NotificationType.SUCCESS, 'Success',
                    `Your new space is created!`, false, null, [primaryAction]);

                this.claimComplete = true;
            },
            (err) => {
                console.log('Error creating space', err);
                this.notifications.message(NotificationType.DANGER, 'Error',
                    `Failed to create "${space.name}"`, false, null, []);
            });
    }

    public changeAcceptTermsConditions($event: boolean) {
        this.acceptTermsConditions = $event;
        this.stepSpaceTermsConditionsRefresh();
    }

    public changeSpaceForm($event: ISpaceForm) {
        this.spaceForm = $event;
        this.stepSpaceInfoRefresh();
    }

    private stepSpaceTermsConditionsRefresh() {
        this.stepSpaceTermsConditionsConfig.nextEnabled
            = this.stepSpaceTermsConditionsConfig.allowNavAway
            = this.acceptTermsConditions;
    }

    private stepSpaceInfoRefresh() {
        this.stepSpaceInfoConfig.nextEnabled
            = this.stepSpaceInfoConfig.allowNavAway
            = !(this.spaceForm == null);
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

}
