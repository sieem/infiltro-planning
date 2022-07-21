import { Component, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { SingleProjectService } from '../../services/single-project.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { dateFormat, formatDate } from '@infiltro/shared';

@Component({
  selector: 'infiltro-single-project-controls',
  template: `
    <div (click)="goToOverview()"><img src="/assets/images/icon-back.svg" alt=""></div>
    <div (click)="onSubmit()"><img [src]="projectForm.touched ? '/assets/images/icon-save.svg' : '/assets/images/icon-save-disabled.svg'" alt=""></div>
    <div *ngIf="projectId$ | async" (click)="removeProject()"><img src="/assets/images/icon-delete.svg" alt=""></div>
    <div (click)="openProjectMail()"><img src="/assets/images/icon-mail.svg" alt=""></div>
    <div (click)="duplicateProject()"><img src="/assets/images/icon-duplicate.svg" alt=""></div>
    <div *ngIf="(newProject$ | async) !== true" [routerLink]="[ 'archief' ]"><img src="/assets/images/icon-archive.svg" alt=""></div>
  `,
  styleUrls: ['./single-project-controls.component.scss']
})
export class SingleProjectControlsComponent {
  @Input() projectForm!: FormGroup;
  projectId$ = this.singleProjectService.projectId$;
  newProject$ = this.singleProjectService.newProject$;
  projectIsSaving = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private singleProjectService: SingleProjectService,
    private toastr: ToastrService,
  ) { }

  goToOverview() {
    if (this.projectForm.touched) {
      if (confirm('Ben je zeker dat je de pagina wil verlaten?')) {
        this.router.navigate(['projecten'])
      } else {
        return
      }
    } else {
      this.router.navigate(['projecten'])
    }
  }

  onSubmit() {
    this.singleProjectService.submitted = true;
    if (this.projectForm.invalid) {
      this.toastr.error('Nog niet alle verplichte velden zijn ingevuld.');
      return;
    }

    if (this.projectIsSaving) {
      this.toastr.error('Project is reeds aan het opslaan');
      return;
    }

    const todayPlusOneYear = formatDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), dateFormat);
    const today = formatDate(new Date(), dateFormat);
    if (formatDate(this.projectForm.value.datePlanned) !== 'Nog te plannen' && (this.projectForm.value.datePlanned < today || todayPlusOneYear < this.projectForm.value.datePlanned)) {
      if (!confirm(`Ben je zeker dat je dit project met ingeplande datum '${formatDate(this.projectForm.value.datePlanned)}' wil opslaan?`)) {
        return;
      }
    }

    this.singleProjectService.saveProject();
  }

  removeProject() {
    if (!this.projectId$.value) {
      throw new Error('no project value');
    }

    if (confirm(`Ben je zeker dat je het project '${this.projectForm.value.projectName}' wil verwijderen?`)) {
      firstValueFrom(this.api.removeProject(this.projectId$.value))
        .then(() => this.router.navigate(['projecten']))
        .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`))
    }
  }

  duplicateProject() {
    if (!this.projectId$.value) {
      throw new Error('no project value');
    }

    firstValueFrom(this.api.duplicateProject(this.projectId$.value))
      .then(({ projectId }) => {
        this.router.navigate(['project', projectId]);
        this.singleProjectService.setProjectId(projectId)
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`))
  }

  openProjectMail() {
    if (!this.projectId$.value) {
      throw new Error('no project value');
    }

    if (this.projectForm.touched) {
      this.toastr.error("Sla eerst je project op voor je mails kunt uitsturen.", "Project is nog niet opgeslagen")
    } else {
      this.router.navigate(['project', this.projectId$.value, 'mail'])
    }

    return // not yet ready
    // this.modalService.open("mail-project-modal")
  }

}
