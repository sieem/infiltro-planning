import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input('comments') comments: any[];
  @Input('readOnly') readOnly: boolean = true;

  constructor(
    public auth: AuthService,
    public singleProjectCommentsService: SingleProjectCommentsService,
  ) { }

  ngOnInit(): void {
  }

}
