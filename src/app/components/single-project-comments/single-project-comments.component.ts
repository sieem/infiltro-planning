import { Component, OnInit, Input } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';

@Component({
  selector: 'app-single-project-comments',
  templateUrl: './single-project-comments.component.html',
  styleUrls: ['./single-project-comments.component.scss']
})
export class SingleProjectCommentsComponent implements OnInit {

  @Input('newProject') newProject: boolean;
  @Input() set projectId(projectId: string) {
    this.singleProjectCommentsService.projectId = (projectId && projectId.trim());
    if (this.singleProjectCommentsService.projectId) this.singleProjectCommentsService.getComments(this.singleProjectCommentsService.projectId)
  }

  constructor(
    public formService: FormService,
    public userService: UserService,
    private auth: AuthService,
    public singleProjectCommentsService: SingleProjectCommentsService,
  ) { }

  ngOnInit() {
    this.singleProjectCommentsService.initForm()
  }

  commentModified(comment: any) {
    return comment.createdDateTime !== comment.modifiedDateTime
  }
}
