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


@Component({
  selector: 'app-single-project',
  templateUrl: './single-project.component.html',
  styleUrls: ['./single-project.component.scss']
})
export class SingleProjectComponent implements OnInit {

  projectForm: FormGroup
  projectEditStates: any = {}
  submitted = false
  projectId: string
  user: any
  mailModalOpened:boolean = false
  hasCalendarItem:boolean = false
  newProject: boolean = true


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
    private toastr: ToastrService,
    private modalService: ModalService) { }

  ngOnInit() {

    this.user = this.auth.getUserDetails()

    this.projectForm = this.formBuilder.group({
      _id: [''],

      company: [ this.user.company , Validators.required],
      dateCreated: [ moment().format(this.formService.dateFormat) , Validators.required],
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

    this.route.params.subscribe(params => {
      if (params['projectId']) {
        this.newProject = false
        this.projectId = params['projectId'];

        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        this.api.getProject(this.projectId).subscribe(
          (res: any) => {
            this.projectForm.setValue({
              _id: res._id,
              company: res.company,
              dateCreated: moment(res.dateCreated).format(this.formService.dateFormat),
              projectType: res.projectType,
              houseAmount: res.houseAmount,
              projectName: res.projectName,
              client: res.client,
              street: res.street,
              city: res.city,
              postalCode: res.postalCode,
              extraInfoAddress: res.extraInfoAddress,
              name: res.name,
              tel: res.tel,
              email: res.email,
              extraInfoContact: res.extraInfoContact,
              EpbReporter: res.EpbReporter,
              ATest: res.ATest,
              v50Value: res.v50Value,
              protectedVolume: res.protectedVolume,
              EpbNumber: res.EpbNumber,
              executor: res.executor,
              datePlanned: moment(res.datePlanned).format(this.formService.dateFormat),
              hourPlanned: res.hourPlanned,
              status: res.status,
            })

            this.hasCalendarItem = (res.eventId && res.calendarId) ? true : false
          },
          err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
        )
      } else {
        this.newProject = true
        this.api.generateProjectId().subscribe(
          res => this.projectForm.controls._id.setValue(res),
          err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
        )
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      this.toastr.error('Nog niet alle verplichte velden zijn ingevuld.');
      return;
    }

    this.saveProject();
  }

  saveProject() {

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
        this.newProject = false
        this.projectId = res._id
        this.toastr.success('Project saved');
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        // reset and refill form so the form isn't touched anymore
        this.projectForm.reset()
        let formDataAsObj:any = {}
        formData.forEach((el, key) => formDataAsObj = {...formDataAsObj, [key]: res[key]})
        formDataAsObj.datePlanned = formDataAsObj.datePlanned || 'Invalid Date'
        this.projectForm.setValue(formDataAsObj)
        this.router.navigate(['/project/' + this.projectId])
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
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

  isEmpty(inputName) {
    if (typeof this.projectForm.value[inputName] === 'string')
      return this.projectForm.value[inputName].trim() == ""
    else
      return false
  }

  changeEditState(inputName, state) {
    this.projectEditStates[inputName] = state
  }

  changeInvoicedStatus() {
    this.projectForm.value.invoiced = !this.projectForm.value.invoiced
  }

  openProjectMail() {
    if (this.auth.isAdmin()) {
      if (this.projectForm.touched) {
        this.toastr.error("Save the project first before you can go to the mailing tool.", "Project isn't saved yet")
      } else {
        this.router.navigate(['/project/' + this.projectId + '/mail'])
      }
      
    } else {
      return // not yet ready
      this.modalService.open("mail-project-modal")
    }
  }

  updateStatusDropdowns() {
    this.projectForm.setValue(this.projectForm.value)
  }

  calendarWarning(hasCalendarItem) {
    if(hasCalendarItem) {
      this.toastr.warning("Google Agenda evenement is aangemaakt. Tijd en datum kunnen enkel nog in Google Agenda aangepast worden.", "Datum ingepland en uur ingepland zijn vergrendeld")
    }
  }

}
