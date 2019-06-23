import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any = []

  constructor(private api:ApiService, public auth:AuthService, public projectService: ProjectService) { }

  ngOnInit() {
    this.getProjects()
  }

  getProjects() {
    console.log(this.auth.getUserDetails())
    this.api.getProjects().subscribe(
      res => this.projects = res,
      err => console.log(err)
    )
  }

}
