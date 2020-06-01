import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
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
  hasCalendarItem: boolean = false
  
  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    public companyService: CompanyService,
    public userService: UserService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public projectService: ProjectService,
    public singleProjectCommentService: SingleProjectCommentsService,
    private toastr: ToastrService,
    private modalService: ModalService,
    public singleProjectService: SingleProjectService) { }

  ngOnInit() {

    this.singleProjectService.initProject();

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

  isEmpty(inputName) {
    if (typeof this.singleProjectService.projectForm.value[inputName] === 'string')
      return this.singleProjectService.projectForm.value[inputName].trim() == ""
    else
      return false
  }

  changeEditState(inputName, state) {
    this.singleProjectService.projectEditStates[inputName] = state
  }

  changeInvoicedStatus() {
    this.singleProjectService.projectForm.value.invoiced = !this.singleProjectService.projectForm.value.invoiced
  }

  calendarWarning(hasCalendarItem) {
    if(hasCalendarItem) {
      this.toastr.warning("Google Agenda evenement is aangemaakt. Tijd en datum kunnen enkel nog in Google Agenda aangepast worden.", "Datum ingepland en uur ingepland zijn vergrendeld")
    }
  }

}
