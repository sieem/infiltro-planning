import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { FormService } from '../../services/form.service';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { emailRegex } from '@infiltro/shared';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'infiltro-reset-password',
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

    const formData = ngFormToFormData(this.resetForm.value);

    firstValueFrom(this.api.resetUser(formData))
      .then(() => this.resetDone = true)

  }
}
