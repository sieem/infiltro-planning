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
  allProjects: any = []
  activeFilter: any = {
    status: [],
    projectType: [],
    executor: []
  }
  sortOptions: any = {
    field: '',
    order: 'asc'
  }

  constructor(private api:ApiService, public auth:AuthService, public projectService: ProjectService) { }

  ngOnInit() {
    this.getProjects()
  }

  getProjects() {
    // console.log(this.auth.getUserDetails())
    this.api.getProjects().subscribe(
      res => {
        this.projects = this.allProjects = res
      },
      err => console.log(err)
    )
  }

  changeFilter(filterCat, filterVal) {
    if (!this.activeFilter[filterCat].includes(filterVal)) {
      this.activeFilter[filterCat] = [...this.activeFilter[filterCat], filterVal]
    } else {
      this.activeFilter[filterCat] = this.activeFilter[filterCat].filter( val => {return val !== filterVal}) 
    }

    this.filterProjects()
    this.sortProjects()
  }

  filterProjects() {
    this.projects = this.allProjects.filter(row => {
      let filterBooleans = []

      for (let [key, values] of Object.entries(this.activeFilter)) {
        let filterArr: any = values
        if (filterArr.length > 0) filterBooleans.push(filterArr.includes(row[key]))
        else filterBooleans.push(true)
      }

      return !filterBooleans.includes(false)
    })
  }

  sortProjects(sortType = '') {
    if (sortType !== '') {
      if (this.sortOptions.field === sortType) {
        this.sortOptions.order = (this.sortOptions.order === 'asc') ? 'desc' : 'asc'
      }
      this.sortOptions.field = sortType
    }


    this.projects = this.projects.sort( (a,b) => {
      let x = a[this.sortOptions.field].toLowerCase()
      let y = b[this.sortOptions.field].toLowerCase()

      if (x == y) return 0

      return (x < y) ? -1 : 1
    })

    if (this.sortOptions.order == 'desc') {
      this.projects = this.projects.reverse()
    }
  }
}
