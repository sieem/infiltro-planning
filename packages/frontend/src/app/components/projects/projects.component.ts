import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from '../../services/modal.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormService } from '../../services/form.service';
import { firstValueFrom, map, Observable } from 'rxjs';
import { BatchModeService } from '../../services/batch-mode.service';
import { statuses, IProject } from '@infiltro/shared';

@Component({
  selector: 'infiltro-projects',
  template: `
    <infiltro-filterbar context="projects"></infiltro-filterbar>
    <div class="projectList" [ngClass]="{'batchMode': batchMode$ | async}">
        <div class="projects">
            <div class="project"
            *ngFor="let project of projectService.projects$ | async; trackBy: trackByFn"
            [ngClass]="[project.status]"
            [class.isFuturePlanned]="isFuturePlanned(project) | async"
            [class.selected]="isSelected(project) && (batchMode$ | async)"
            (click)="selectProject(project)">
                <div class="company" [innerHTML]="project.company | company | async | safeHtml"></div>
                <ng-container *ngIf="(batchMode$ | async) === false; else batchMode">
                    <div class="title" [routerLink]="[ '/project', project._id ]">
                        <span *ngIf="project.dateActive | isDateActiveTooOld: project.status" class="error">!</span>
                        <span [innerHTML]="project.projectName | safeHtml"></span> /
                        <span [innerHTML]="project.projectType | projectType | safeHtml"></span> /
                        {{project.houseAmount}}
                    </div>
                </ng-container>
                <ng-template #batchMode>
                    <div class="title">
                        <span *ngIf="project.dateActive | isDateActiveTooOld: project.status" class="error">!</span>
                        <span [innerHTML]="project.projectName | safeHtml"></span> /
                        <span [innerHTML]="project.projectType | projectType | safeHtml"></span> /
                        {{project.houseAmount}}
                    </div>
                </ng-template>


                <div class="status">
                    <div class="read" (click)="selectProject(project)"
                    (window:keydown)="registerCtrlKey($event)"
                    (window:keyup)="registerCtrlKey($event)"
                        *ngIf="!isSelected(project) || (batchMode$ | async) || !auth.isAdmin()">
                        <span [innerHTML]="project.status | status | safeHtml"></span>
                    </div>
                    <div class="write" *ngIf="isSelected(project) && auth.isAdmin() && (batchMode$ | async) === false">
                        <select name="status" id="status" (change)="changeStatus($event)">
                            <option value="">Selecteer status</option>
                            <option *ngFor="let status of statuses" [value]="status.type" [selected]="status.type === project.status">{{status.name}}</option>
                        </select>
                    </div>
                </div>
                <div class="address">
                    <span [innerHTML]="project.street | safeHtml"></span>,
                    <span [innerHTML]="project.postalCode | safeHtml"></span>&nbsp;
                    <span [innerHTML]="project.city | safeHtml"></span>
                    <ng-container *ngIf="project.extraInfoAddress">, </ng-container>
                    <span *ngIf="project.extraInfoAddress" class="extraInfoAddress" [innerHTML]="project.extraInfoAddress | safeHtml"></span>
                </div>
                <div class="dateHourCreated" title="Laatst aangepast: {{ project.dateEdited | formatDate:'time' }}">
                    <span [innerHTML]="project.dateActive | formatDate:'empty' | safeHtml"></span>
                </div>
                <div class="dateHourPlanned">
                    <b>
                        <span [innerHTML]="project.executor | executor | safeHtml"></span>
                    </b>
                    <br>
                    <span [innerHTML]="project.datePlanned | formatDate | safeHtml"></span>
                    <ng-container *ngIf="project.hourPlanned"> om <span [innerHTML]="project.hourPlanned | safeHtml"></span></ng-container>
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
                                <infiltro-comments [comments]="project.comments"></infiltro-comments>
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
                <li *ngFor="let selectedProject of selectedProjects$ | async">{{ selectedProject.projectName }} / {{ selectedProject.projectType | projectType }} / {{ selectedProject.houseAmount}}</li>
            </ul>
            <form [formGroup]="batchForm" (ngSubmit)="onSubmit()">
                <div class="projectRow">
                    <select name="status" id="status" formControlName="status">
                        <option value="">Selecteer status</option>
                        <option *ngFor="let status of statuses" [value]="status.type">{{status.name}}</option>
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
  statuses = statuses;

  batchMode$ = this.batchModeService.batchMode$;
  batchForm = this.formBuilder.group({
    status: ['', Validators.required]
  });
  submitted = false;
  ctrlKeyDown = false;
  currentHoverComment = '';
  now = new Date();
  selectedProjects$ = this.batchModeService.selectedProjects$;

  constructor(
    private api: ApiService,
    public auth: AuthService,
    public projectService: ProjectService,
    private formBuilder: FormBuilder,
    public formService: FormService,
    private toastr: ToastrService,
    private modalService: ModalService,
    private batchModeService: BatchModeService,
    ) { }

  ngOnInit() {
    this.projectService.getProjects()
  }

  trackByFn(_: number, item: any) {
    return item._id;
  }

  registerCtrlKey(event: any) {
    if (navigator.platform.match(/mac/gi)) {
      this.ctrlKeyDown = (event.metaKey && event.type === "keydown")
    } else {
      this.ctrlKeyDown = (event.ctrlKey && event.type === "keydown")
    }
  }

  async selectProject(project: IProject) {
    const selectedProjects = await firstValueFrom(this.selectedProjects$);

    if (this.batchMode$.value) {
      if (!selectedProjects.includes(project)) {
        this.selectedProjects$.next([...selectedProjects, project])
      } else {
        this.selectedProjects$.next(selectedProjects.filter(val => { return val !== project }))
      }

    } else if (this.ctrlKeyDown) {
      this.selectedProjects$.next([project])
    }
  }

  isSelected(project: IProject) {
    return this.selectedProjects$.value.includes(project);
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
    this.batchMode$.next(false);
    this.selectedProjects$.next([]);
    this.modalService.close("batchmode-modal")
  }

  changeStatus(event: any) {
    const statusToChange = event.srcElement.selectedOptions[0].value;
    firstValueFrom(this.api.batchProjects({ status: statusToChange, projects: this.selectedProjects$.value }))
      .then(() => {
        this.projectService.getProjects();
        this.selectedProjects$.next([]);
      })

  }

  onSubmit() {
    if (!this.batchMode$.value) {
      return;
    }
    this.submitted = true;

    if (this.batchForm.invalid) {
      this.toastr.error('Gelieve een status te kiezen');
      return;
    }

    firstValueFrom(this.api.batchProjects({ status: this.batchForm.value.status, projects: this.selectedProjects$.value }))
      .then(() => {
        this.batchMode$.next(false);
        this.submitted = false;
        this.projectService.getProjects();
        this.modalService.close("batchmode-modal");
        this.selectedProjects$.next([]);
      })

  }
}
