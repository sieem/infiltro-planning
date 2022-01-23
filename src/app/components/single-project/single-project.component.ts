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


@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
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

    this.singleProjectService.initProject();

    this.route.params.subscribe(params => {
      if (params.projectId) {
        this.singleProjectService.newProject = false;
        this.singleProjectService.setProjectId(params.projectId);
        if (this.singleProjectService.archiveActive) {
          return;
        }
        this.singleProjectService.fillInProject();
      } else {
        this.singleProjectService.newProject = true;
        firstValueFrom(this.api.generateProjectId())
          .then((res) => {
            this.singleProjectService.setProjectId(res);
            this.singleProjectService.projectForm.controls._id.setValue(res);
          })
          .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
      }
    })
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
