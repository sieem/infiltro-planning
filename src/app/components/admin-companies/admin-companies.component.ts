import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.scss']
})
export class AdminCompaniesComponent implements OnInit {
  companyForm: FormGroup
  submitted = false


  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    public companyService: CompanyService) { }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
    })
  }

  onSubmit() {
    this.submitted = true

    if (this.companyForm.invalid) {
      alert('form invalid');
      return;
    }

    this.saveCompany()
  }

  saveCompany() {

    const formData = new FormData()
    formData.append('name', this.companyForm.value.name)

    this.api.saveCompany(formData).subscribe(
      (res: any) => {
        this.companyService.companies.push(res)
        this.companyForm.reset()
      },
      err => console.log(err)
    )
  }

  removeCompany(company: any) {
    if (confirm(`Are you sure to delete ${company.name}?`)) {
      this.api.removeCompany(company._id).subscribe(
        (res: any) => {
          this.companyService.companies = this.removeElementFromArray(this.companyService.companies, company._id)
        },
        err => console.log(err)
      )
    }
  }

  removeElementFromArray(array:any , id:string) {
    for (const key in array) {
        if (array[key]._id === id) {
          array.splice(key,1)
          return array
        }
    }
  }
}
