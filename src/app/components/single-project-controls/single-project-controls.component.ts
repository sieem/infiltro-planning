import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup } from '@angular/forms';
import { SingleProjectService } from 'src/app/services/single-project.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-single-project-controls',
  templateUrl: './single-project-controls.component.html',
  styleUrls: ['./single-project-controls.component.scss']
})
export class SingleProjectControlsComponent implements OnInit {
  @Input('projectForm') projectForm: FormGroup;
  @Input('projectId') projectId: string;
  projectIsSaving: boolean = false

  constructor(
    private api: ApiService,
    private router: Router,
    public auth: AuthService,
    public singleProjectService: SingleProjectService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  goToOverview() {
    if (this.projectForm.touched) {
      if (confirm('Ben je zeker dat je de pagina wil verlaten?')) {
        this.router.navigate(['/projecten'])
      } else {
        return
      }
    } else {
      this.router.navigate(['/projecten'])
    }
  }

  onSubmit() {
    this.singleProjectService.submitted = true;
    for (const item in this.projectForm.controls) {
      if (this.projectForm.controls.hasOwnProperty(item)) {
        const element = this.projectForm.controls[item];
        if (element.status !== "VALID") console.log(item)
      }
    }
    console.log(this.projectForm.controls);
    if (this.projectForm.invalid) {
      this.toastr.error('Nog niet alle verplichte velden zijn ingevuld.');
      return;
    }

    if (this.projectIsSaving) {
      this.toastr.error('Project is reeds aan het opslaan');
      return;
    }

    this.singleProjectService.saveProject();
  }

  removeProject() {
    if (confirm(`Ben je zeker dat je het project '${this.projectForm.value.projectName}' wil verwijderen?`)) {
      this.api.removeProject(this.projectId).subscribe(
        (res: any) => {
          this.router.navigate(['/projecten'])
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }

  duplicateProject() {
    this.api.duplicateProject(this.projectId).subscribe(
      (res: any) => {
        this.router.navigate(['/project/' + res.projectId])
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  openProjectMail() {
    if (this.projectForm.touched) {
      this.toastr.error("Save the project first before you can go to the mailing tool.", "Project isn't saved yet")
    } else {
      this.router.navigate(['/project/' + this.projectId + '/mail'])
    }

    return // not yet ready
    // this.modalService.open("mail-project-modal")
  }

}
