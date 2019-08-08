import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  user: any;

  constructor(
    private formBuilder: FormBuilder, 
    private api: ApiService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public formService: FormService, 
    public auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      _id: [''],
      password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
    })

    this.activatedRoute.params.subscribe(params => {
      let resetToken = params['resetToken'];
      this.getUserByResetToken(resetToken)
    });
    
  }

  getUserByResetToken(resetToken: string) {
    this.api.getUserByResetToken(resetToken).subscribe(
      (userId:string) => {
        this.registerForm.setValue({
          _id: userId,
          password: '',
        })
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
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

    const formData = new FormData();
    formData.append('_id', this.registerForm.value._id)
    formData.append('password', this.registerForm.value.password)

    this.api.registerUser(formData).subscribe(
      (res: any) => {
        this.auth.saveToken(res.token)
        this.router.navigate(['/projecten'])
      },
      err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
    )
  }
}
