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


  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    public companyService: CompanyService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public projectService: ProjectService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.user = this.auth.getUserDetails()

    this.projectForm = this.formBuilder.group({
      _id: [''],

      company: [{ value: this.user.company }, Validators.required],
      dateCreated: [{ value: moment().format(this.formService.dateFormat) }, Validators.required],
      projectType: ['house', Validators.required],
      houseAmount: [1, Validators.required],
      projectName: ['', Validators.required],
      client: [''],

      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['1000', [Validators.required, Validators.pattern(this.formService.postalCodeRegex)]],
      extraInfoAddress: [''],

      name: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.formService.emailRegex)]],
      extraInfoContact: [''],
      EpbReporter: ['', Validators.required],

      ATest: [''],
      v50Value: [''],
      protectedVolume: [''],
      EpbNumber: [''],

      executor: [{ value: '', disabled: !this.auth.isAdmin() }],
      datePlanned: [{ value: '', disabled: !this.auth.isAdmin() }],
      hourPlanned: [{ value: '', disabled: !this.auth.isAdmin() }],
      status: [{ value: '', disabled: !this.auth.isAdmin() }],

      comments: [''],

      invoiced: [{ value: '', disabled: !this.auth.isAdmin() }],
    })

    Object.keys(this.projectForm.controls).forEach(key => {
      this.projectEditStates[key] = true
    })

    this.route.params.subscribe(params => {
      if (params['projectId']) {
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
              comments: res.comments,
              invoiced: (res.invoiced == undefined) ? false : res.invoiced
            })
          },
          err => console.log(err)
        )
      }
    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.projectForm.invalid) {
      this.toastr.error('Project invalid');
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
    formData.append('comments', this.projectForm.value.comments)
    formData.append('invoiced', this.projectForm.value.invoiced)

    this.api.saveProject(formData).subscribe(
      (res: any) => {
        this.toastr.success('Project saved');
        // this.router.navigate(['/projects', res.projectId])
        Object.keys(this.projectForm.controls).forEach(key => {
          this.projectEditStates[key] = false
        })

        // reset and refill form so the form isn't touched anymore
        this.projectForm.reset()
        let formDataAsObj = {}
        formData.forEach((el, key) => formDataAsObj = {...formDataAsObj, [key]: el})
        this.projectForm.setValue(formDataAsObj)
      },
      err => console.log(err)
    )
  }


  removeProject() {
    if (confirm(`Are you sure to delete ${this.projectForm.value.projectName}?`)) {
      this.api.removeProject(this.projectId).subscribe(
        (res: any) => {
          this.router.navigate(['/projects'])
        },
        err => console.log(err)
      )
    }
  }

  goToOverview() {
    if (this.projectForm.touched) {
      if (confirm(`Ben je zeker dat je terug wilt? Je aanpassingen zullen niet opgeslagen worden.`)) {
        this.router.navigate(['/projects'])
      } else {
        return
      }
    } else {
      this.router.navigate(['/projects'])
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

  newlineToBr(value) {
    if (value)
      return value.replace(/\n/g, "<br>")
  }

  changeInvoicedStatus() {
    this.projectForm.value.invoiced = !this.projectForm.value.invoiced
  }

}
