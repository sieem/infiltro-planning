import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  editState = false;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    private router: Router,
    public formService: FormService,
    public companyService: CompanyService,
    public auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      _id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.formService.emailRegex)]],
      company: ['', Validators.required],
      role: ['', Validators.required],
    })

    this.auth.getUsers()

  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.registerUser()
  }

  registerUser() {

    const formData = new FormData();
    
    formData.append('name', this.registerForm.value.name)
    formData.append('email', this.registerForm.value.email)
    formData.append('company', this.registerForm.value.company)
    formData.append('role', this.registerForm.value.role)

    if (!this.registerForm.value._id) {
      this.api.addUser(formData).subscribe(
        (res: any) => {
          this.auth.users.push(res)
          this.registerForm.reset()
          this.toastr.success('User saved', 'Sent mail to user!');
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    } else {
      formData.append('_id', this.registerForm.value._id)
      this.editState = false
      this.api.editUser(formData).subscribe(
        (res: any) => {
          this.auth.users = this.updateElementInArray(this.auth.users, res)
          this.registerForm.reset()
          this.toastr.success('User saved');
        },
        err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
      )
    }

    
  }

  editUser(user) {
    this.editState = true

    this.registerForm.setValue({
      _id: user._id || "",
      name: user.name || "",
      email: user.email || "",
      company: user.company || "",
      role: user.role || ""
    })
  }

  removeUser(user: any) {
    if (confirm(`Are you sure to delete ${user.email}?`)) {
      if (confirm(`Are you really sure you want to delete ${user.email}???`)) {
        this.api.removeUser(user._id).subscribe(
          (res: any) => {
            this.auth.users = this.removeElementInArray(this.auth.users, user._id)
          },
          err => this.toastr.error(err.error, `Error ${err.status}: ${err.statusText}`)
        )
      }
    }
  }

  removeElementInArray(array: any, id: string) {
    for (const key in array) {
      if (array[key]._id === id) {
        array.splice(key, 1)
        return array
      }
    }
    return array
  }

  updateElementInArray(array: any, element: any) {
    for (const key in array) {
      if (array[key]._id === element._id) {
        array[key] = element
        return array
      }
    }
    return array
  }
}
