import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    private router: Router, 
    public formService: FormService, 
    public companyService: CompanyService, 
    public auth:AuthService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
      company: [''],
      role: ['', Validators.required],
    })
    
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.registerUser();
  }

  registerUser() {

    const formData = new FormData();
    formData.append('email', this.registerForm.value.email);
    formData.append('password', this.registerForm.value.password);
    formData.append('company', this.registerForm.value.company);
    formData.append('role', this.registerForm.value.role);

    this.api.registerUser(formData).subscribe(
      (res: any) => {
        this.auth.saveToken(res.token)
        // this.auth.saveUserDetails()
        this.router.navigate(['/projects'])
      },
      err => console.log(err)
    )
  }
}
