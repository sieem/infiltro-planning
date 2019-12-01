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

  batchMode: boolean = false
  selectedProjects: any = []
  batchForm: FormGroup;
  submitted: boolean = false;
  ctrlKeyDown: boolean = false;

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
    this.projectService.getProjects()
    this.batchForm = this.formBuilder.group({
      status: ['', Validators.required]
    })
  }

  toggleBatchMode() {
    if (this.batchMode && this.selectedProjects.length > 0) {
      this.modalService.open("batchmode-modal")
    }
    this.batchMode = !this.batchMode
  }

  registerCtrlKey(event) {
    if (navigator.platform.match(/mac/gi)) {
      this.ctrlKeyDown = (event.metaKey && event.type === "keydown")
    } else {
      this.ctrlKeyDown = (event.ctrlKey && event.type === "keydown")
    }
  }

  selectProject(project) {
    if (this.batchMode) {
      if (!this.selectedProjects.includes(project)) {
        this.selectedProjects = [...this.selectedProjects, project]
      } else {
        this.selectedProjects = this.selectedProjects.filter(val => { return val !== project })
      }
      
    } else if (this.ctrlKeyDown) {
      this.selectedProjects = [project]
    }
  }

  isSelected(project) {
    return (this.selectedProjects.includes(project))
  }

  isFuturePlanned(project) {
    return (this.projectService.sortOptions.field === "datePlanned" && new Date(project.datePlanned) > new Date())
  }

  cancelBatchMode() {
    this.batchMode = false
    this.selectedProjects = []
    this.modalService.close("batchmode-modal")
  }

  changeStatus(event) {
    const statusToChange = event.srcElement.selectedOptions[0].value;
    this.api.batchProjects({ status: statusToChange, projects: this.selectedProjects }).subscribe(
      (res: any) => {
        this.projectService.getProjects()
        this.selectedProjects = []
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
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
        this.projectService.getProjects()
        this.modalService.close("batchmode-modal")
        this.selectedProjects = []
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }
}
