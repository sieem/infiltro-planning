import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { emailRegex } from 'src/app/utils/regex.util';

@Component({
  selector: 'app-reset-password',
  template: `
    <ng-container *ngIf="!resetDone; else elseTemplate">
      <form [formGroup]="resetForm" class="wrapper" (ngSubmit)="onSubmit()">
        <div class="inputGroup">
          <label for="email">E-mail</label>
          <input type="email" name="email" formControlName="email">
          <p *ngIf="formService.checkInputField(resetForm, 'email', submitted)" class="error">!</p>
        </div>

        <div class="inputGroup right">
          <input type="submit" value="Nieuw wachtwoord aanvragen">
        </div>
      </form>
    </ng-container>
    <ng-template #elseTemplate>
      <div>Wachtwoordherstel aangevraagd, controleer je mailbox voor verder instructies.</div>
    </ng-template>
  `,
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
  });
  submitted = false;
  user: any;
  resetDone = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    public auth: AuthService,
    private toastr: ToastrService) { }


  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      this.toastr.error('Ongeldig e-mailadres');
      return;
    }

    this.resetUser()
  }

  resetUser() {

    const formData = new FormData();
    formData.append('email', this.resetForm.value.email)

    firstValueFrom(this.api.resetUser(formData))
      .then(() => this.resetDone = true)
      .catch((err) => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`));
  }
}
