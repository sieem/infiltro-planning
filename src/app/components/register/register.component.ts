import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
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
  submitted: boolean = false;
  userId: string;
  user: any;

  constructor(private formBuilder: FormBuilder, 
    private api: ApiService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    public formService: FormService, 
    public companyService: CompanyService, 
    public auth:AuthService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      _id: [''],
      password: ['', [Validators.required, Validators.pattern(this.formService.passwordRegex)]],
    })

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['userId'];
      this.getUser(this.userId)
    });
    
  }

  getUser(userId: string) {
    this.api.getUser(userId).subscribe(
      (res:any) => {
        this.registerForm.setValue({
          _id: res._id,
          password: '',
        })
      },
      err => console.log(err)
    )
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
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
        this.router.navigate(['/projects'])
      },
      err => console.log(err)
    )
  }
}
