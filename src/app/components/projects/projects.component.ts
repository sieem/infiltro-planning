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
import { firstValueFrom, map, Observable } from 'rxjs';
import { ProjectEnumsService } from 'src/app/services/project-enums.service';

@Component({
  selector: 'app-projects',
  template: `
    <div class="controls" *ngIf="projectService.activeFilter$ | async as activeFilter">
        <a [routerLink]="[ '/project/toevoegen' ]" class="btn red"><img src="/assets/images/icon-new.svg" alt=""> New project</a>
        <div class="btn filter status">
            <span class="title">Toon ook <span class="error" *ngIf="activeFilter.status.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('status', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('status', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let status of projectEnumsService.statuses" (click)="projectService.changeFilter('status', status.type)">
                    <ng-container *ngIf="!status.onlyAdmin || (status.onlyAdmin && auth.isAdmin() )">
                        <img src="/assets/images/icon-unchecked.svg" alt="" *ngIf="!activeFilter.status.includes(status.type)">
                        <img src="/assets/images/icon-checked.svg" alt="" *ngIf="activeFilter.status.includes(status.type)">
                        <span>{{status.name}}</span>
                    </ng-container>
                </div>
            </div>
        </div>

        <div class="btn filter executor" *ngIf="auth.isAdmin()">
            <span class="title">Uitvoerder <span class="error" *ngIf="activeFilter.executor.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('executor', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('executor', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let executor of projectEnumsService.executors"
                    (click)="projectService.changeFilter('executor', executor.type)">
                    <img src="/assets/images/icon-unchecked.svg" alt=""
                        *ngIf="!activeFilter.executor.includes(executor.type)">
                    <img src="/assets/images/icon-checked.svg" alt=""
                        *ngIf="activeFilter.executor.includes(executor.type)">
                    <span>{{executor.name}}</span>
                </div>
            </div>
        </div>

        <div class="btn filter company" *ngIf="auth.isAdmin()">
            <span class="title">Bedrijf <span class="error" *ngIf="activeFilter.company.length === 0"><span>!</span></span></span>
            <div class="dropdown">
                <div class="select-options">
                    <div>Selecteer</div>
                    <div class="btn" (click)="projectService.selectAllFilter('company', true)">Alles</div>
                    <div class="btn" (click)="projectService.selectAllFilter('company', false)">Niets</div>
                </div>
                <div class="item" *ngFor="let company of companyService.companies$ | async"
                    (click)="projectService.changeFilter('company', company._id)">
                    <img src="/assets/images/icon-unchecked.svg" alt=""
                        *ngIf="!activeFilter.company.includes(company._id)">
                    <img src="/assets/images/icon-checked.svg" alt=""
                        *ngIf="activeFilter.company.includes(company._id)">
                    <span>{{company.name}}</span>
                </div>
            </div>
        </div>

        <div class="btn filter sort" *ngIf="projectService.sortOptions$ | async as sortOptions" [ngClass]="sortOptions.order">
            <span class="title">Sorteer</span>
            <div class="dropdown">
                <div class="item" *ngFor="let sortable of projectEnumsService.sortables" (click)="projectService.setSortable(sortable.type)">
                    <ng-container *ngIf="sortable.sort">
                        <img src="/assets/images/icon-unchecked.svg" alt="" *ngIf="sortOptions.field !== sortable.type">
                        <img src="/assets/images/icon-checked.svg" alt="" *ngIf="sortOptions.field === sortable.type">
                        <span>{{sortable.name}}</span>
                        <span class="arrow desc" *ngIf="sortOptions.field === sortable.type && sortOptions.order === 'desc'"><img src="/assets/images/icon-arrow.svg" alt=""></span>
                        <span class="arrow asc" *ngIf="sortOptions.field === sortable.type && sortOptions.order === 'asc'"><img src="/assets/images/icon-arrow.svg" alt=""></span>
                    </ng-container>
                </div>
            </div>
        </div>
        <div class="btn filter batch" *ngIf="auth.isAdmin()" (click)="toggleBatchMode()">
                <span *ngIf="!batchMode" class="title">Batch status</span>
                <span *ngIf="batchMode && selectedProjects.length === 0" class="title">Stop batch status</span>
                <span *ngIf="batchMode && selectedProjects.length > 0" class="title">Pas projecten aan</span>
        </div>
        <div class="search">
            <input type="text" name="search" [value]="projectService.searchTerm$ | async" (input)="projectService.setSearchTerm($event)" placeholder="Zoeken">
        </div>
    </div>

    <div class="projectList" [ngClass]="{'batchMode': batchMode}">
        <div class="projects">
            <div class="project"
            *ngFor="let project of projectService.projects$ | async; trackBy: trackByFn"
            [ngClass]="[project.status]"
            [class.isFuturePlanned]="isFuturePlanned(project) | async"
            [class.selected]="isSelected(project) && batchMode"
            (click)="selectProject(project)">
                <div class="company" [innerHTML]="project.company | company | async | highlightText: projectService.searchTerm$ | async | safeHtml"></div>
                <ng-container *ngIf="!batchMode; else noBatchMode">
                    <div class="title" [routerLink]="[ '/project', project._id ]">
                        <span *ngIf="project.dateActive | isDateActiveTooOld: project.status" class="error">!</span>
                        <span [innerHTML]="project.projectName | highlightText: projectService.searchTerm$ | async | safeHtml"></span> /
                        <span [innerHTML]="project.projectType | projectType | highlightText: projectService.searchTerm$ | async | safeHtml"></span> /
                        {{project.houseAmount}}
                    </div>
                </ng-container>
                <ng-template #noBatchMode>
                    <div class="title">
                        <span *ngIf="project.dateActive | isDateActiveTooOld: project.status" class="error">!</span>
                        <span [innerHTML]="project.projectName | highlightText: projectService.searchTerm$ | async | safeHtml"></span> /
                        <span [innerHTML]="project.projectType | projectType | highlightText: projectService.searchTerm$ | async | safeHtml"></span> /
                        {{project.houseAmount}}
                    </div>
                </ng-template>


                <div class="status">
                    <div class="read" (click)="selectProject(project)"
                    (window:keydown)="registerCtrlKey($event)"
                    (window:keyup)="registerCtrlKey($event)"
                        *ngIf="!isSelected(project) || batchMode || !auth.isAdmin()">
                        <span [innerHTML]="project.status | status | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                    </div>
                    <div class="write" *ngIf="isSelected(project) && auth.isAdmin() && !batchMode">
                        <select name="status" id="status" (change)="changeStatus($event)">
                            <option value="">Selecteer status</option>
                            <option *ngFor="let status of projectEnumsService.statuses" [value]="status.type" [selected]="status.type === project.status">{{status.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="address">
                    <span [innerHTML]="project.street | highlightText: projectService.searchTerm$ | async | safeHtml"></span>,
                    <span [innerHTML]="project.postalCode | highlightText: projectService.searchTerm$ | async | safeHtml"></span>&nbsp;
                    <span [innerHTML]="project.city | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                    <ng-container *ngIf="project.extraInfoAddress">, </ng-container>
                    <span *ngIf="project.extraInfoAddress" class="extraInfoAddress" [innerHTML]="project.extraInfoAddress | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                </div>
                <div class="dateHourCreated" title="Laatst aangepast: {{ project.dateEdited | formatDate:'time' }}">
                    <span [innerHTML]="project.dateActive | formatDate:'empty' | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                </div>
                <div class="dateHourPlanned">
                    <b>
                        <span [innerHTML]="project.executor | executor | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                    </b>
                    <br>
                    <span [innerHTML]="project.datePlanned | formatDate | highlightText: projectService.searchTerm$ | async | safeHtml"></span>
                    <ng-container *ngIf="project.hourPlanned"> om <span [innerHTML]="project.hourPlanned | highlightText: projectService.searchTerm$ | async | safeHtml"></span></ng-container>
                </div>
                <div class="technicalDataFilledIn">
                    <ng-container *ngIf="projectService.isTechnicalDataFilledIn(project); else technicalDataNotFilledIn">
                        <img src="/assets/images/icon-okay.svg" alt="">
                    </ng-container>
                    <ng-template #technicalDataNotFilledIn>
                        <img src="/assets/images/icon-not-okay.svg" alt="">
                    </ng-template>
                </div>
                <div class="mailsSent">
                    <ng-container *ngIf="project.mails.length > 0">
                        <a [routerLink]="['/project/' + project._id + '/mail']">
                            <img src="/assets/images/icon-mail.svg" alt="">
                        </a>
                    </ng-container>
                </div>

                <div class="commentGiven">
                    <ng-container *ngIf="project.comments.length > 0">
                        <div class="commentContainer">
                            <img src="/assets/images/icon-comment.svg" alt="" (mouseenter)="showComment(project._id)" (mouseleave)="hideComment()"
                                (click)="showComment(project._id)">
                            <div class="hoverComment" *ngIf="currentHoverComment === project._id">
                                <app-comments [comments]="project.comments"></app-comments>
                            </div>
                        </div>
                    </ng-container>
                </div>
            </div>
        </div>

        <div class="empty">
            <img src="/assets/images/icon-broken-house.svg" alt="broken house">
            <span>Geen projecten gevonden :(</span>
        </div>
    </div>
    <infiltro-modal id="batchmode-modal">
        <div class="batchmode wrapper">
            <h2>Batch verwerking</h2>
            <h4>Geselecteerde projecten</h4>
            <ul class="selectedProjects">
                <li *ngFor="let selectedProject of this.selectedProjects">{{ selectedProject.projectName }} / {{ selectedProject.projectType | projectType }} / {{ selectedProject.houseAmount}}</li>
            </ul>
            <form [formGroup]="batchForm" (ngSubmit)="onSubmit()">
                <div class="projectRow">
                    <select name="status" id="status" formControlName="status">
                        <option value="">Selecteer status</option>
                        <option *ngFor="let status of projectEnumsService.statuses" [value]="status.type">{{status.name}}</option>
                    </select>
                    <p *ngIf="formService.checkInputField(batchForm, 'status', submitted)" class="error">!</p>
                </div>

                <div class="buttons">
                    <div>
                        <button (click)="cancelBatchMode()">Annuleer</button>
                    </div>
                    <div>
                        <input type="submit" value="Batch verwerken">
                    </div>
                </div>
            </form>
        </div>
    </infiltro-modal>
  `,
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

  isFuturePlanned(project: IProject): Observable<boolean> {
    return this.projectService.sortOptions$.pipe(
      map(({field, order}) => field === "datePlanned" && order === "asc" && new Date(project.datePlanned) > new Date())
    )
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

  }
}
