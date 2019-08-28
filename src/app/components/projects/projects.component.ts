import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects: any = []
  allProjects: any = []
  activeFilter: any = {
    status: ['toContact', 'toPlan', 'proposalSent', 'planned', 'executed', 'reportAvailable', 'conformityAvailable', 'onHold'],
    executor: ['david','roel', 'together']
  }
  sortOptions: any = {
    field: 'datePlanned',
    order: 'asc'
  }
  batchMode: boolean = false
  selectedProjects: any = []
  batchForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public companyService: CompanyService,
    public projectService: ProjectService,
    private formBuilder: FormBuilder,
    public formService: FormService,
    private toastr: ToastrService,
    private modalService: ModalService) { }

  ngOnInit() {
    this.getProjects()
    this.batchForm = this.formBuilder.group({
      status: ['', Validators.required]
    })
  }

  getProjects() {
    // console.log(this.auth.getUserDetails())
    this.api.getProjects().subscribe(
      res => {
        this.projects = this.allProjects = res
        this.filterProjects()
        this.sortProjects()
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
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
      let filterBooleans = [true]

      for (let [key, values] of Object.entries(this.activeFilter)) {
        let filterArr: any = values
        if (filterArr.length > 0 && row[key] !== '') {
          filterBooleans.push(filterArr.includes(row[key]))
        }
        else {
          filterBooleans.push(true)
        }
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


    this.projects = this.projects.sort((a, b) => {
      if (!a[this.sortOptions.field]) return 1;
      if (!b[this.sortOptions.field]) return -1;

      let x = a[this.sortOptions.field].toLowerCase()
      let y = b[this.sortOptions.field].toLowerCase()

      if (x == y) return 0

      return (x < y) ? -1 : 1
    })

    if (this.sortOptions.order == 'desc') {
      this.projects = this.projects.reverse()
    }
  }

  toggleBatchMode() {
    if (this.batchMode && this.selectedProjects.length > 0) {
      this.modalService.open("batchmode-modal")
    }
    this.batchMode = !this.batchMode
  }

  selectProject(project) {
    if (this.batchMode) {
      if (!this.selectedProjects.includes(project)) {
        this.selectedProjects = [...this.selectedProjects, project]
      } else {
        this.selectedProjects = this.selectedProjects.filter(val => { return val !== project })
      }
      
    }
  }

  isSelected(project) {
    return (this.selectedProjects.includes(project)) ? 'selected' : '';
  }

  cancelBatchMode() {
    this.batchMode = false
    this.selectedProjects = []
    this.modalService.close("batchmode-modal")
  }

  onSubmit() {
    this.submitted = true;

    if (this.batchForm.invalid) {
      this.toastr.error('Gelieve een status te kiezen');
      return;
    }

    this.api.batchProjects({ status: this.batchForm.value.status, projects: this.selectedProjects }).subscribe(
      (res: any) => {
        this.batchMode = false
        this.submitted = false
        this.getProjects()
        this.modalService.close("batchmode-modal")
        this.selectedProjects = []
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }
}
