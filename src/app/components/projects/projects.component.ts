import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/services/company.service';
import { ModalService } from 'src/app/services/modal.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { UserService } from 'src/app/services/user.service';
import { IProject } from '../../interfaces/project.interface';
import { firstValueFrom } from 'rxjs';
import { ProjectEnumsService } from 'src/app/services/project-enums.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  batchMode = false;
  selectedProjects: IProject[] = [];
  batchForm = this.formBuilder.group({
    status: ['', Validators.required]
  });
  submitted = false;
  ctrlKeyDown = false;
  currentHoverComment = '';
  now = new Date();

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public companyService: CompanyService,
    public projectService: ProjectService,
    private formBuilder: FormBuilder,
    public formService: FormService,
    private toastr: ToastrService,
    public userService: UserService,
    private modalService: ModalService,
    public projectEnumsService: ProjectEnumsService,
    ) { }

  ngOnInit() {
    this.projectService.getProjects()
  }

  trackByFn(index: number, item: any) {
    return item._id;
  }

  toggleBatchMode() {
    if (this.batchMode && this.selectedProjects.length > 0) {
      this.modalService.open("batchmode-modal")
    } else {
      this.batchMode = !this.batchMode
    }
  }

  registerCtrlKey(event: any) {
    if (navigator.platform.match(/mac/gi)) {
      this.ctrlKeyDown = (event.metaKey && event.type === "keydown")
    } else {
      this.ctrlKeyDown = (event.ctrlKey && event.type === "keydown")
    }
  }

  selectProject(project: IProject) {
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

  isSelected(project: IProject) {
    return (this.selectedProjects.includes(project))
  }

  isFuturePlanned(project: IProject) {
    return this.projectService.sortOptions$.value.field === "datePlanned" && this.projectService.sortOptions$.value.order === "asc" && new Date(project.datePlanned) > new Date()
  }

  showComment(projectId:string) {
    if (this.currentHoverComment) {
      this.hideComment()
      return
    }

    this.currentHoverComment = projectId
  }

  hideComment() {
    this.currentHoverComment = ''
  }

  cancelBatchMode() {
    this.batchMode = false
    this.selectedProjects = []
    this.modalService.close("batchmode-modal")
  }

  changeStatus(event: any) {
    const statusToChange = event.srcElement.selectedOptions[0].value;
    firstValueFrom(this.api.batchProjects({ status: statusToChange, projects: this.selectedProjects }))
      .then(() => {
        this.projectService.getProjects();
        this.selectedProjects = [];
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }

  onSubmit() {
    if (!this.batchMode) {
      return;
    }
    this.submitted = true;

    if (this.batchForm.invalid) {
      this.toastr.error('Gelieve een status te kiezen');
      return;
    }

    firstValueFrom(this.api.batchProjects({ status: this.batchForm.value.status, projects: this.selectedProjects }))
      .then(() => {
        this.batchMode = false;
        this.submitted = false;
        this.projectService.getProjects();
        this.modalService.close("batchmode-modal");
        this.selectedProjects = [];
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }
}
