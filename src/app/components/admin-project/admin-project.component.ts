import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-project',
  templateUrl: './admin-project.component.html',
  styleUrls: ['./admin-project.component.scss']
})
export class AdminProjectComponent implements OnInit {

  projectForm: FormGroup
  submitted = false
  projectId: string
  user: any
  dateFormat: string = 'YYYY-DD-MM'
  

  constructor(
    private formBuilder: FormBuilder, 
    private api: ApiService, 
    private router: Router, 
    public formService: FormService, 
    public companyService: CompanyService, 
    public auth: AuthService, 
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.user = this.auth.getUserDetails()

    this.projectForm = this.formBuilder.group({
      _id: [''],

      company: [{ value: this.user.company, disabled: !this.auth.isAdmin() }, Validators.required],
      dateCreated: [{ value: moment().format(this.dateFormat), disabled: !this.auth.isAdmin()}, Validators.required],
      projectType: ['house', Validators.required],
      houseAmount: [1, Validators.required],
      projectName: ['', Validators.required],
      client: ['', Validators.required],

      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['B-1000', [Validators.required, Validators.pattern(this.formService.postalCodeRegex)]],
      extraInfoAddress: [''],

      name: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.formService.emailRegex)]],
      extraInfoContact: [''],
      EpbReporter: ['', Validators.required],

      ATest: [''],
      v50Value: [''],
      protectedVolume: [''],

      executor: [{value:'', disabled: !this.auth.isAdmin()}],
      datePlanned: [{value:'', disabled: !this.auth.isAdmin()}],
      hourPlanned: [{value:'', disabled: !this.auth.isAdmin()}],
      status: [{value:'', disabled: !this.auth.isAdmin()}],
      
      comments: [''],

      invoiced: [{ value: '', disabled: !this.auth.isAdmin() }],
    })


    this.route.params.subscribe(params => {
      if(params['projectId']) {
        this.projectId = params['projectId'];
        this.api.getProject(this.projectId).subscribe(
          (res: any) => {
            this.projectForm.setValue({
              _id: res._id,
              company: res.company,
              dateCreated: moment(res.dateCreated).format(this.dateFormat),
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
              executor: res.executor,
              datePlanned: moment(res.datePlanned).format(this.dateFormat),
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
    formData.append('executor', this.projectForm.value.executor)
    formData.append('datePlanned', this.projectForm.value.datePlanned)
    formData.append('hourPlanned', this.projectForm.value.hourPlanned)
    formData.append('status', this.projectForm.value.status)
    formData.append('comments', this.projectForm.value.comments)
    formData.append('invoiced', this.projectForm.value.invoiced)

    this.api.saveProject(formData).subscribe(
      (res: any) => {
        this.router.navigate(['/projects', res.projectId])
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

}