import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any = []

  constructor(private api:ApiService, public auth:AuthService) { }

  ngOnInit() {
    this.getProjects()
  }

  formatDate(value) {
    return moment(value).format("DD-MM-YYYY")
  }

  getProjects() {
    console.log(this.auth.getUserDetails())
    this.api.getProjects().subscribe(
      res => this.projects = res,
      err => console.log(err)
    )
  }

}
