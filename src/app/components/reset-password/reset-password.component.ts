import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
  });
  submitted = false;
  user: any;
  resetDone = false;

  constructor(
    private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
