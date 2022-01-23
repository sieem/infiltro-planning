import { Component, Input } from '@angular/core';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';
import { SingleProjectService } from 'src/app/services/single-project.service';

@Component({
  selector: 'app-single-project-comments',
  templateUrl: './single-project-comments.component.html',
  styleUrls: ['./single-project-comments.component.scss']
})
export class SingleProjectCommentsComponent {
  @Input('newProject') newProject = false;

  constructor(
    public singleProjectCommentsService: SingleProjectCommentsService,
    public singleProjectService: SingleProjectService,
  ) { }
}
