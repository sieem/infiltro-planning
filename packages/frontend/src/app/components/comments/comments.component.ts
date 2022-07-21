import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { SingleProjectCommentsService } from '../../services/single-project-comments.service';
import { IComment } from '@infiltro/shared';

@Component({
  selector: 'infiltro-comments',
  template: `
    <div class="list comments">
        <div class="comment" *ngFor="let comment of comments | reverse">
            <div class="user">{{comment.user | user | async}}</div>
            <div class="modifiedDateTime">{{comment.modifiedDateTime | formatDate: 'time' }}</div>
            <div class="content" [innerHTML]="comment.content | newlineToBr | safeHtml"></div>
            <ng-container *ngIf="!readOnly">
                <div class="icon edit"
                    *ngIf="auth.getUserDetails()?.id === comment.user || auth.isAdmin()"
                    (click)="singleProjectCommentsService.editComment(comment)">
                    <img src="assets/images/icon-edit.svg" alt="">
                </div>
                <div class="icon delete"
                    *ngIf="auth.getUserDetails()?.id === comment.user || auth.isAdmin()"
                    (click)="singleProjectCommentsService.removeComment(comment)">
                    <img src="assets/images/icon-delete.svg" alt="">
                </div>
            </ng-container>
        </div>
    </div>
  `,
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Input() comments!: IComment[] | null;
  @Input() readOnly = true;

  constructor(
    public auth: AuthService,
    public singleProjectCommentsService: SingleProjectCommentsService,
  ) { }

}
