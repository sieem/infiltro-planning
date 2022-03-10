import { Component, Input, OnDestroy } from '@angular/core';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';
import { SingleProjectService } from 'src/app/services/single-project.service';

@Component({
  selector: 'app-single-project-comments',
  template: `
    <form [formGroup]="singleProjectCommentsService.commentForm" class="wrapper noBorder" (ngSubmit)="singleProjectCommentsService.onSubmit()" *ngIf="!singleProjectService.archiveActive">
      <div class="inputGroup">
        <textarea name="content" id="content" formControlName="content" rows="3"></textarea>
      </div>

      <div class="inputGroup right submit">
        <ng-container *ngIf="singleProjectCommentsService.editState; else elseTemplate">
          <input type="submit" value="Opmerking aanpassen">
        </ng-container>
        <ng-template #elseTemplate>
          <input type="submit" *ngIf="!newProject" value="Opmerking toevoegen">
        </ng-template>
      </div>

      <app-comments [comments]="singleProjectCommentsService.comments$ | async" [readOnly]="singleProjectService.archiveActive"></app-comments>
    </form>
  `,
  styleUrls: ['./single-project-comments.component.scss']
})
export class SingleProjectCommentsComponent implements OnDestroy {
  @Input() newProject!: boolean | null;

  constructor(
    public singleProjectCommentsService: SingleProjectCommentsService,
    public singleProjectService: SingleProjectService,
  ) { }

  ngOnDestroy(): void {
    this.singleProjectCommentsService.destroyComments();
  }
}
