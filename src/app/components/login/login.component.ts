import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { emailRegex, passwordRegex } from 'src/app/utils/regex.util';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="loginForm" class="wrapper" (ngSubmit)="onSubmit()">
      <div class="inputGroup">
        <label for="email">E-mail</label>
        <input type="email" name="email" formControlName="email">
        <p *ngIf="formService.checkInputField(loginForm, 'email', submitted)" class="error">!</p>
      </div>


      <div class="inputGroup">
        <label for="password">Wachtwoord</label>
        <input type="password" name="password" formControlName="password">
        <p *ngIf="formService.checkInputField(loginForm, 'password', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup right">
          <input type="submit" value="Inloggen">
      </div>

      <a routerLink="/herstel-wachtwoord" routerLinkActive="active">Wachtwoord vergeten?</a>
    </form>
  `,
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
  });
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    private auth: AuthService,
    private toastr: ToastrService) { }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.error('Ongeldig e-mailadres of wachtwoord');
      return;
    }

    this.loginUser();
  }

  loginUser() {

    const formData = ngFormToFormData(this.loginForm.value);

    firstValueFrom(this.api.loginUser(formData))
      .then((res: any) => {
        this.auth.saveToken(res.token)
        this.router.navigate(['projecten'])
      })

  }
}
