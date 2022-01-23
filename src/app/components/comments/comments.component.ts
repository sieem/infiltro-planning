import { Component, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';
import { IComment } from '../../interfaces/comments.interface';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {
  @Input('comments') comments!: IComment[] | null;
  @Input('readOnly') readOnly: boolean = true;

  constructor(
    public auth: AuthService,
    public singleProjectCommentsService: SingleProjectCommentsService,
  ) { }

}
