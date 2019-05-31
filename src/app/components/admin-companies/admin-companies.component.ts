import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-admin-companies',
  templateUrl: './admin-companies.component.html',
  styleUrls: ['./admin-companies.component.scss']
})
export class AdminCompaniesComponent implements OnInit {
  companyForm: FormGroup
  submitted = false

  companies: any = []

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router, private formService: FormService) { }

  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
    })

    this.getCompanies()
  }

  getCompanies() {
    this.api.getCompanies().subscribe(
      res => this.companies = res,
      err => console.log(err)
    )
  }

  onSubmit() {
    this.submitted = true

    if (this.companyForm.invalid) {
      return;
    }

    this.saveCompany()
  }

  saveCompany() {

    const formData = new FormData()
    formData.append('name', this.companyForm.value.name)

    this.api.saveCompany(formData).subscribe(
      (res: any) => {
        this.companies.push(res)
        this.companyForm.reset()
      },
      err => console.log(err)
    )
  }

  removeCompany(company: any) {
    this.api.removeCompany(company).subscribe(
      (res: any) => {
        this.companies = this.removeElementFromArray(this.companies, company._id)
      },
      err => console.log(err)
    )
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
