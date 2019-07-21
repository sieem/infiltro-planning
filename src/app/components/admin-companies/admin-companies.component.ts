import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { ToastrService } from 'ngx-toastr';

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
    public formService: FormService,
    public companyService: CompanyService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
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
    formData.append('email', this.companyForm.value.email)

    this.api.saveCompany(formData).subscribe(
      (res: any) => {
        if (!this.companyForm.value._id) {
          this.companyService.companies.push(res)
        } else {
          this.companyService.companies = this.updateElementInArray(this.companyService.companies, res)
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
      email: company.email || ""
    })
  }

  removeCompany(company: any) {
    if (confirm(`Are you sure to delete ${company.name}?`)) {
      this.api.removeCompany(company._id).subscribe(
        (res: any) => {
          this.companyService.companies = this.removeElementInArray(this.companyService.companies, company._id)
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }
  }

  removeElementInArray(array:any , id:string) {
    for (const key in array) {
        if (array[key]._id === id) {
          array.splice(key,1)
          return array
        }
    }
    return array
  }

  updateElementInArray(array: any, element: any) {
    for (const key in array) {
      if (array[key]._id === element._id) {
        array[key] = element
        return array
      }
    }
    return array
  }
}
