import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router, private formService: FormService, private auth:AuthService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loginUser();
  }

  loginUser() {

    const formData = new FormData();
    formData.append('email', this.loginForm.value.email);
    formData.append('password', this.loginForm.value.password);

    this.api.loginUser(formData).subscribe(
      (res: any) => {
        this.auth.saveToken(res.token)
        // this.auth.saveUserDetails()
        this.router.navigate(['/projects'])
      },
      err => console.log(err)
    )
  }
}
