import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { FormService } from '../../services/form.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { ProjectService } from '../../services/project.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { SingleProjectCommentsService } from '../../services/single-project-comments.service';
import { SingleProjectService } from '../../services/single-project.service';
import { SingleProjectArchiveService } from '../../services/single-project-archive.service';
import { firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { projectTypes, statuses, executors } from '@infiltro/shared';

@UntilDestroy()
@Component({
  selector: 'infiltro-single-project',
  template: `
    <div class="wrapper" [ngClass]="singleProjectService.projectForm.value.status">
      <div class="projectSection">
          <div class="topControls">
            <infiltro-single-project-controls [projectForm]="singleProjectService.projectForm" class="left controls" *ngIf="!singleProjectService.archiveActive"></infiltro-single-project-controls>
            <div class="right">
              <infiltro-single-project-row label="Contactpersoon binnen" field="company" type="select" firstValue="Selecteer bedrijf" [dataSource]="companyService.companies$ | async" valueKey="_id" [readOnly]="!auth.isAdmin()">
              </infiltro-single-project-row>

              <infiltro-single-project-row label=":" field="EpbReporter" type="select" firstValue="Selecteer EPB verslaggever" [dataSource]="userService.users$ | async | filterUsers:singleProjectService.projectForm.value.company" valueKey="_id" [showAsterisk]="false" [readOnly]="auth.isClient()">
              </infiltro-single-project-row>
            </div>
          </div>
      </div>
      <ng-container *ngIf="companyService.hasClientsOf$ | async">
        <div class="projectSection">
            <div class="topControls">
              <div class="right">
                <infiltro-single-project-row label="Klant" field="client" type="select" firstValue="Selecteer klant" [dataSource]="companyService.clientsOf$ | async" valueKey="_id" [readOnly]="!auth.isAdmin()">
                </infiltro-single-project-row>
              </div>
            </div>
        </div>
      </ng-container>
      <div class="projectSection">
        <div class="projectRow">
          <h2>{{singleProjectService.projectForm.value.projectName}}</h2>
        </div>
      </div>
      <div class="projectSection twoColumns">
        <div class="left">
          <infiltro-single-project-row label="Type" field="projectType" type="select" firstValue="Selecteer type" [dataSource]="projectTypes" valueKey="type">
          </infiltro-single-project-row>

          <infiltro-single-project-row label="Aantal / omschrijving" field="houseAmount" type="input">
          </infiltro-single-project-row>

          <infiltro-single-project-row label="Referentie" field="projectName" type="input">
          </infiltro-single-project-row>
        </div>
        <div class="right">
            <infiltro-single-project-row label="Status" field="status" type="select" firstValue="Selecteer status" [dataSource]="statuses" valueKey="type">
            </infiltro-single-project-row>
            <infiltro-single-project-row label="Datum ingave" field="dateCreated" type="date" [readOnly]="!auth.isAdmin()" [showAsterisk]="false">
            </infiltro-single-project-row>
            <infiltro-single-project-row label="Actief sinds" field="dateActive" type="date" [readOnly]="!auth.isAdmin()" [showAsterisk]="false">
            </infiltro-single-project-row>
        </div>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Adres</h2>
        </div>
        <infiltro-single-project-row label="Straat + Nr" field="street" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Gemeente" field="city" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Postcode" field="postalCode" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Bijkomende aanwijzingen" field="extraInfoAddress" type="textarea">
        </infiltro-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Contactgegevens</h2>
        </div>

        <infiltro-single-project-row label="Naam" field="name" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Telefoonnummer(s)" field="tel" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="E-mail" field="email" type="input">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Bijkomende gegevens" field="extraInfoContact" type="textarea">
        </infiltro-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Technische gegevens</h2>
        </div>

        <infiltro-single-project-row label="A-test (m<sup>2</sup>)" field="ATest" type="textarea">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="v50-waarde (m<sup>3</sup>/h.m<sup>2</sup>)" field="v50Value" type="textarea">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Beschermd volume (m<sup>3</sup>)" field="protectedVolume" type="textarea">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="EPB Dossiernummer" field="EpbNumber" type="input">
        </infiltro-single-project-row>
      </div>

      <div class="projectSection">
        <div class="projectRow">
          <h2>Uitvoergegevens</h2>
        </div>

        <infiltro-single-project-row label="Uitvoerder" field="executor" type="select" firstValue="Selecteer uitvoerder" [dataSource]="executors" valueKey="type" [readOnly]="!auth.isAdmin()">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Datum ingepland" field="datePlanned" type="date" [readOnly]="!auth.isAdmin() || singleProjectService.hasCalendarItem" (click)="calendarWarning(singleProjectService.hasCalendarItem)">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Uur ingepland" field="hourPlanned" type="time" [readOnly]="!auth.isAdmin() || singleProjectService.hasCalendarItem" (click)="calendarWarning(singleProjectService.hasCalendarItem)">
        </infiltro-single-project-row>

        <infiltro-single-project-row label="Status" field="status" type="select" firstValue="Selecteer status" [dataSource]="statuses" valueKey="type">
        </infiltro-single-project-row>
      </div>


      <div class="projectSection" *ngIf="!singleProjectService.archiveActive">
        <div class="projectRow">
          <h2>Opmerkingen</h2>
        </div>
        <infiltro-single-project-comments [newProject]="singleProjectService.newProject$ | async"></infiltro-single-project-comments>
      </div>
    </div>
  `,
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit, OnDestroy {
  projectTypes = projectTypes;
  statuses = statuses;
  executors = executors;

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
          .then((generatedProjectId) => {
            this.singleProjectService.setProjectId(generatedProjectId);
            this.singleProjectService.projectForm.controls['_id'].setValue(generatedProjectId);
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
