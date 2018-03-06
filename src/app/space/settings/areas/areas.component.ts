import { Notifications, Notification, NotificationType } from '../../../ngx/ngx-base';
import { Router, ActivatedRoute } from '@angular/router';
import { ContextService } from '../../../ngx-impl/ngx-clarksnut-impl/context.service';
import { Context, SpaceService, Space } from '../../../ngx/ngx-clarksnut';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'cn-areas',
  templateUrl: 'areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit, OnDestroy {

  form: FormGroup;

  private space: Space;
  private context: Context;
  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private contexts: ContextService,
    private notifications: Notifications,
    private spaceService: SpaceService) {
    this.form = this.formBuilder.group({
      assignedId: [null, Validators.compose([Validators.required, Validators.maxLength(20)])],
      name: [null, Validators.compose([Validators.required, Validators.maxLength(250)])],
      description: [null, Validators.compose([Validators.maxLength(250)])],
    });

    this.subscriptions.push(
      this.contexts.current.subscribe(val => this.context = val)
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.spaceService.getSpaceById(this.context.space.id).subscribe(val => {
        this.space = val;
        this.form.patchValue({
          assignedId: val.attributes.assignedId,
          name: val.attributes.name,
          description: val.attributes.description
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => {
      subs.unsubscribe();
    });
  }

  updateSpace() {
    // const patch = {
    //   attributes: this.form.value,
    //   type: 'spaces',
    //   id: this.space.id
    // } as Space;

    // this.spaceService.update(patch).subscribe(val => {
    //   this.notifications.message({
    //     message: `Space updated`,
    //     type: NotificationType.SUCCESS
    //   } as Notification);
    //   console.log(`Space name updated.`);
    // });
  }

  routeToSpaceHome() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  save() {

  }

}

