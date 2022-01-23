import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, switchMap } from 'rxjs';
import { passwordRegex } from 'src/app/utils/regex.util';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="registerForm" class="wrapper" (ngSubmit)="onSubmit()">
      <div class="inputGroup">
        <label for="password">Wachtwoord</label>
        <input type="password" name="password" formControlName="password">
        <p *ngIf="formService.checkInputField(registerForm, 'password', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup right">
          <div>Kies een wachtwoord met minstens een hoofdletter, cijfer en leesteken</div>
      </div>

      <div class="inputGroup right">
        <input type="submit" value="Registreren">
      </div>
    </form>
  `,
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm = this.formBuilder.group({
    _id: [''],
    password: ['', [Validators.required, Validators.pattern(passwordRegex)]],
  });
  submitted = false;
  user: any;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formService: FormService,
    public auth: AuthService,
    private toastr: ToastrService) { }

  async ngOnInit(): Promise<void> {
    const userId = await firstValueFrom(this.activatedRoute.params.pipe(switchMap((params) => this.api.getUserByResetToken(params.resetToken))))
    this.registerForm.setValue({
      _id: userId,
      password: '',
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.toastr.error('Wachtwoord is niet moeilijk genoeg. Gelieve een wachtwoord te kiezen met minstens een hoofdletter en een cijfer.');
      return;
    }

    this.registerUser()
  }

  registerUser() {
    const formData = ngFormToFormData(this.registerForm.value);

    firstValueFrom(this.api.registerUser(formData))
      .then((res: any) => {
        this.auth.saveToken(res.token)
        this.router.navigate(['projecten'])
      })
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }
}
