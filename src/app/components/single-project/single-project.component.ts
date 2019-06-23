import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit {
  project: any = []
  projectId: string

  constructor(private api: ApiService, private auth: AuthService, private route: ActivatedRoute, public projectService:ProjectService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.projectId = params['projectId'];
      this.getProject(this.projectId)
    });
  }

  newlineToBr(value) {
    if(value)
    return value.replace(/\n/g,"<br>")
  }

  getProject(projectId: string) {
    this.api.getProject(projectId).subscribe(
      res => this.project = res,
      err => console.log(err)
    )
  }

}
