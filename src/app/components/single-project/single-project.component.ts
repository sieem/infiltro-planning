import { Component, OnInit, ComponentFactoryResolver, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProjectService } from 'src/app/services/project.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'src/app/services/modal.service';
import { UserService } from 'src/app/services/user.service';
import { SingleProjectCommentsService } from 'src/app/services/single-project-comments.service';
import { SingleProjectService } from 'src/app/services/single-project.service';


@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit {

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
    public singleProjectService: SingleProjectService) { }

  ngOnInit() {

    this.singleProjectService.initProject();

    if (this.singleProjectService.archiveActive) {
      return;
    }

    this.route.params.subscribe(params => {
      if (params.projectId) {
        this.singleProjectService.fillInProject(params.projectId);
      } else {
        this.singleProjectService.newProject = true
        this.api.generateProjectId().subscribe(
          res => this.singleProjectService.projectForm.controls._id.setValue(res),
          err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
        )
      }
    })
  }
  ngOnDestroy() {
    this.singleProjectService.archiveActive = false;
  }

  calendarWarning(hasCalendarItem) {
    if(hasCalendarItem) {
      this.toastr.warning("Google Agenda evenement is aangemaakt. Tijd en datum kunnen enkel nog in Google Agenda aangepast worden.", "Datum ingepland en uur ingepland zijn vergrendeld")
    }
  }

}
