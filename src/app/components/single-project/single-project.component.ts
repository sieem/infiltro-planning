import { Component, OnInit, ComponentFactoryResolver, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { SingleProjectArchiveService } from 'src/app/services/single-project-archive.service';
import { firstValueFrom } from 'rxjs';
import { ProjectEnumsService } from 'src/app/services/project-enums.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-single-project',
  template: `
    <div class="wrapper" [ngClass]="singleProjectService.projectForm.value.status">
      <div class="projectSection">
          <div class="topControls">
            <app-single-project-controls [projectForm]="singleProjectService.projectForm" class="left controls" *ngIf="!singleProjectService.archiveActive"></app-single-project-controls>
            <div class="right">
              <app-single-project-row label="Contactpersoon binnen" field="company" type="select" firstValue="Selecteer bedrijf" [dataSource]="companyService.companies$ | async" valueKey="_id" [readOnly]="!auth.isAdmin()">
              </app-single-project-row>

              <app-single-project-row label=":" field="EpbReporter" type="select" firstValue="Selecteer EPB verslaggever" [dataSource]="userService.users$ | async | filterUsers:singleProjectService.projectForm.value.company" valueKey="_id" [showAsterisk]="false">
              </app-single-project-row>
            </div>
          </div>
      </div>
      <div class="projectSection">
        <div class="projectRow">
          <h2>{{singleProjectService.projectForm.value.projectName}}</h2>
        </div>
      </div>
      <div class="projectSection twoColumns">
        <div class="left">
          <app-single-project-row label="Type" field="projectType" type="select" firstValue="Selecteer type" [dataSource]="projectEnumsService.projectTypes" valueKey="type">
          </app-single-project-row>

          <app-single-project-row label="Aantal / omschrijving" field="houseAmount" type="input">
          </app-single-project-row>

          <app-single-project-row label="Referentie" field="projectName" type="input">
          </app-single-project-row>
        </div>
        <div class="right">
            <app-single-project-row label="Status" field="status" type="select" firstValue="Selecteer status" [dataSource]="projectEnumsService.statuses" valueKey="type">
            </app-single-project-row>
            <app-single-project-row label="Datum ingave" field="dateCreated" type="date" [readOnly]="!auth.isAdmin()" [showAsterisk]="false">
            </app-single-project-row>
            <app-single-project-row label="Actief sinds" field="dateActive" type="date" [readOnly]="!auth.isAdmin()" [showAsterisk]="false">
            </app-single-project-row>
        </div>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Adres</h2>
        </div>
        <app-single-project-row label="Straat + Nr" field="street" type="input">
        </app-single-project-row>

        <app-single-project-row label="Gemeente" field="city" type="input">
        </app-single-project-row>

        <app-single-project-row label="Postcode" field="postalCode" type="input">
        </app-single-project-row>

        <app-single-project-row label="Bijkomende aanwijzingen" field="extraInfoAddress" type="textarea">
        </app-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Contactgegevens</h2>
        </div>

        <app-single-project-row label="Naam" field="name" type="input">
        </app-single-project-row>

        <app-single-project-row label="Telefoonnummer(s)" field="tel" type="input">
        </app-single-project-row>

        <app-single-project-row label="E-mail" field="email" type="input">
        </app-single-project-row>

        <app-single-project-row label="Bijkomende gegevens" field="extraInfoContact" type="textarea">
        </app-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Technische gegevens</h2>
        </div>

        <app-single-project-row label="A-test (m<sup>2</sup>)" field="ATest" type="textarea">
        </app-single-project-row>

        <app-single-project-row label="v50-waarde (m<sup>3</sup>/h.m<sup>2</sup>)" field="v50Value" type="textarea">
        </app-single-project-row>

        <app-single-project-row label="Beschermd volume (m<sup>3</sup>)" field="protectedVolume" type="textarea">
        </app-single-project-row>

        <app-single-project-row label="EPB Dossiernummer" field="EpbNumber" type="input">
        </app-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Uitvoergegevens</h2>
        </div>

        <app-single-project-row label="Uitvoerder" field="executor" type="select" firstValue="Selecteer uitvoerder" [dataSource]="projectEnumsService.executors" valueKey="type" [readOnly]="!auth.isAdmin()">
        </app-single-project-row>

        <app-single-project-row label="Datum ingepland" field="datePlanned" type="date" [readOnly]="!auth.isAdmin() || singleProjectService.hasCalendarItem" (click)="calendarWarning(singleProjectService.hasCalendarItem)">
        </app-single-project-row>

        <app-single-project-row label="Uur ingepland" field="hourPlanned" type="time" [readOnly]="!auth.isAdmin() || singleProjectService.hasCalendarItem" (click)="calendarWarning(singleProjectService.hasCalendarItem)">
        </app-single-project-row>

        <app-single-project-row label="Status" field="status" type="select" firstValue="Selecteer status" [dataSource]="projectEnumsService.statuses" valueKey="type">
        </app-single-project-row>
      </div>


      <div class="projectSection" *ngIf="!singleProjectService.archiveActive">
        <div class="projectRow">
          <h2>Opmerkingen</h2>
        </div>
        <app-single-project-comments [newProject]="singleProjectService.newProject$ | async"></app-single-project-comments>
      </div>
    </div>
  `,
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit, OnDestroy {

  constructor(
    private api: ApiService,
    public formService: FormService,
    public companyService: CompanyService,
    public userService: UserService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public singleProjectCommentService: SingleProjectCommentsService,
    private toastr: ToastrService,
    public singleProjectService: SingleProjectService,
    private singleProjectArchiveService: SingleProjectArchiveService,
    public projectEnumsService: ProjectEnumsService,
    ) { }

  ngOnInit() {
    firstValueFrom(this.route.params).then(({projectId}) => {
      if (projectId) {
        this.singleProjectService.newProject$.next(false);
        this.singleProjectService.setProjectId(projectId);
        if (this.singleProjectService.archiveActive) {
          return;
        }
      } else {
        this.singleProjectService.newProject$.next(true);
        firstValueFrom(this.api.generateProjectId())
          .then((res) => {
            this.singleProjectService.setProjectId(res);
            this.singleProjectService.projectForm.controls._id.setValue(res);
          })

      }
    });

    this.singleProjectService.projectData$.pipe(untilDestroyed(this)).subscribe();
  }

  ngOnDestroy() {
    this.singleProjectService.archiveActive = false;
    this.singleProjectArchiveService.activeProject = 0;
  }

  calendarWarning(hasCalendarItem: boolean) {
    if(hasCalendarItem) {
      this.toastr.warning("Google Agenda evenement is aangemaakt. Tijd en datum kunnen enkel nog in Google Agenda aangepast worden.", "Datum ingepland en uur ingepland zijn vergrendeld")
    }
  }

}
