import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  success = false;

  constructor(private formBuilder: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      // source: https://stackoverflow.com/questions/40513352/email-validation-using-form-builder-in-angular-2-latest-version
      email: ['', [Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]],
      // source: https://stackoverflow.com/a/19605207
      password: ['', [Validators.required, Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$")]],
    });
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
    formData.append('password', this.registerForm.value.name);

    this.api.registerUser(formData).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token)
        this.router.navigate(['/overview'])

      },
      err => console.log(err)
    );
  }

  checkInputField(field: string) {
    return this.registerForm.get(field).invalid && (this.registerForm.get(field).dirty || this.registerForm.get(field).touched)
  }

}
