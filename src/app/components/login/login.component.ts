import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
    password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
  });
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    private auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.error('Ongeldig e-mailadres of wachtwoord');
      return;
    }

    this.loginUser();
  }

  loginUser() {

    const formData = new FormData();
    formData.append('email', this.loginForm.value.email);
    formData.append('password', this.loginForm.value.password);

    firstValueFrom(this.api.loginUser(formData))
      .then((res: any) => {
        this.auth.saveToken(res.token)
        this.router.navigate(['/projecten'])
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }
}
