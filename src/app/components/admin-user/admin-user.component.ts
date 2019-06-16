import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    public companyService: CompanyService,
    public auth: AuthService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
      company: ['', Validators.required],
      role: ['', Validators.required],
    })

  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.registerUser()
  }

  registerUser() {

    const formData = new FormData();
    formData.append('email', this.registerForm.value.email)
    formData.append('company', this.registerForm.value.company)
    formData.append('role', this.registerForm.value.role)

    this.api.addUser(formData).subscribe(
      (res: any) => {
        console.log(res)
      },
      err => console.log(err)
    )
  }
}
