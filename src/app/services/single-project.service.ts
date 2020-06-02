import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { CompanyService } from './company.service';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from './modal.service';
import * as moment from 'moment';
import { SingleProjectCommentsService } from './single-project-comments.service';
import { FormService } from './form.service';

@Injectable({
  providedIn: 'root'
})
export class SingleProjectService {
  projectForm: FormGroup
  projectIsSaving: boolean = false;
  projectEditStates: any = {}
  submitted = false
  projectId: string
  user: any
  mailModalOpened: boolean = false
  hasCalendarItem: boolean = false
  newProject: boolean = true
  archiveActive: boolean = false

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
  ) { }

  initProject() {
    this.user = this.auth.getUserDetails()

    this.projectForm = this.formBuilder.group({
      _id: [''],

      company: [this.user.company, Validators.required],
      dateCreated: [moment().format(this.formService.dateFormat), Validators.required],
      projectType: ['house', Validators.required],
      houseAmount: [1, Validators.required],
      projectName: ['', Validators.required],
      client: [''],

      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(this.formService.postalCodeRegex)]],
      extraInfoAddress: [''],

      name: [''],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.formService.emailRegex)]],
      extraInfoContact: [''],
      EpbReporter: [this.user.id, Validators.required],

      ATest: [''],
      v50Value: [''],
      protectedVolume: [''],
      EpbNumber: [''],

      executor: [''],
      datePlanned: [''],
      hourPlanned: [''],
      status: ['toPlan'],
    })

    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectEditStates[key] = true
    })
  }

  fillInProject() {
    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectEditStates[key] = false
    })

    this.api.getProject(this.projectId).subscribe(
      (res: any) => {
        this.fillInFormGroup(res);
      },
      err => {
        this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
        this.router.navigate(['/'])
      }
    )
  }

  fillInFormGroup(formData) {
    this.projectForm.setValue({
      _id: formData._id,
      company: formData.company,
      dateCreated: moment(formData.dateCreated).format(this.formService.dateFormat),
      projectType: formData.projectType,
      houseAmount: formData.houseAmount,
      projectName: formData.projectName,
      client: formData.client,
      street: formData.street,
      city: formData.city,
      postalCode: formData.postalCode,
      extraInfoAddress: formData.extraInfoAddress,
      name: formData.name,
      tel: formData.tel,
      email: formData.email,
      extraInfoContact: formData.extraInfoContact,
      EpbReporter: formData.EpbReporter,
      ATest: formData.ATest,
      v50Value: formData.v50Value,
      protectedVolume: formData.protectedVolume,
      EpbNumber: formData.EpbNumber,
      executor: formData.executor,
      datePlanned: moment(formData.datePlanned).format(this.formService.dateFormat),
      hourPlanned: formData.hourPlanned,
      status: formData.status,
    })

    this.hasCalendarItem = (formData.eventId && formData.calendarId) ? true : false
  }

  saveProject() {
    this.projectIsSaving = true;

    const formData = new FormData();

    formData.append('_id', this.projectForm.value._id)
    formData.append('company', this.projectForm.value.company)
    formData.append('dateCreated', this.projectForm.value.dateCreated)
    formData.append('projectType', this.projectForm.value.projectType)
    formData.append('houseAmount', this.projectForm.value.houseAmount)
    formData.append('projectName', this.projectForm.value.projectName)
    formData.append('client', this.projectForm.value.client)
    formData.append('street', this.projectForm.value.street)
    formData.append('city', this.projectForm.value.city)
    formData.append('postalCode', this.projectForm.value.postalCode)
    formData.append('extraInfoAddress', this.projectForm.value.extraInfoAddress)
    formData.append('name', this.projectForm.value.name)
    formData.append('tel', this.projectForm.value.tel)
    formData.append('email', this.projectForm.value.email)
    formData.append('extraInfoContact', this.projectForm.value.extraInfoContact)
    formData.append('EpbReporter', this.projectForm.value.EpbReporter)
    formData.append('ATest', this.projectForm.value.ATest)
    formData.append('v50Value', this.projectForm.value.v50Value)
    formData.append('protectedVolume', this.projectForm.value.protectedVolume)
    formData.append('EpbNumber', this.projectForm.value.EpbNumber)
    formData.append('executor', this.projectForm.value.executor)
    formData.append('datePlanned', this.projectForm.value.datePlanned)
    formData.append('hourPlanned', this.projectForm.value.hourPlanned)
    formData.append('status', this.projectForm.value.status)

    this.api.saveProject(formData).subscribe(
      (res: any) => {
        this.singleProjectCommentService.onSubmit();

        this.newProject = false
        this.projectId = res._id
        this.toastr.success('Project saved');
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        // reset and refill form so the form isn't touched anymore
        this.projectForm.reset()
        let formDataAsObj: any = {}
        formData.forEach((el, key) => formDataAsObj = { ...formDataAsObj, [key]: res[key] })
        formDataAsObj.datePlanned = formDataAsObj.datePlanned || 'Invalid Date'
        this.projectForm.setValue(formDataAsObj)
        this.projectIsSaving = false;
        this.hasCalendarItem = (res.eventId && res.calendarId) ? true : false
        this.router.navigate(['/project/' + this.projectId])
      },
      err => {
        this.projectIsSaving = false;
        this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      }
    )
  }
}
