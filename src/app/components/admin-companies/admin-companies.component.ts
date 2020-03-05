import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.scss']
})
export class AdminCompaniesComponent implements OnInit {
  companyForm: FormGroup
  submitted = false
  editState = false


  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public auth: AuthService,
    public formService: FormService,
    public companyService: CompanyService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      pricePageVisible: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern(this.formService.emailRegex)]],
    })
  }

  onSubmit() {
    this.submitted = true

    if (this.companyForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.saveCompany()
  }

  saveCompany() {

    const formData = new FormData()
    formData.append('_id', this.companyForm.value._id)
    formData.append('name', this.companyForm.value.name)
    formData.append('pricePageVisible', this.companyForm.value.pricePageVisible)
    formData.append('email', this.companyForm.value.email)

    this.api.saveCompany(formData).subscribe(
      (res: any) => {
        if (!this.companyForm.value._id) {
          this.companyService.companies.push(res)
        } else {
          this.companyService.companies = this.formService.updateElementInArray(this.companyService.companies, res)
        }
        
        this.companyForm.reset()
        this.editState = false
        this.toastr.success('Company saved');
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }

  editCompany(company) {
    this.editState = true

    this.companyForm.setValue({
      _id: company._id || "",
      name: company.name || "",
      email: company.email || "",
      pricePageVisible: company.pricePageVisible || "",
    })
  }

  removeCompany(company: any) {
    if (confirm(`Are you sure to delete ${company.name}?`)) {
      this.api.removeCompany(company._id).subscribe(
        (res: any) => {
          this.companyService.companies = this.formService.removeElementInArray(this.companyService.companies, company._id)
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }
}
