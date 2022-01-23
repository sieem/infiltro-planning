import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormService } from 'src/app/services/form.service';
import { CompanyService } from 'src/app/services/company.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { IUser } from '../../interfaces/user.interface';
import { firstValueFrom } from 'rxjs';
import { emailRegex } from 'src/app/utils/regex.util';
import { ngFormToFormData } from '../../utils/form.utils';

@Component({
  selector: 'app-admin-user',
  template: `
    <div class="list users">
      <h1>User admin</h1>
      <div class="item" *ngFor="let user of userService.users$ | async">
        <div>{{user.name}} ({{user.email}})</div>
        <div>{{ user.company | company | async }}</div>
        <div>{{userService.roleName(user.role)}}</div>
        <div class="icon" (click)="editUser(user)"><img src="assets/images/icon-edit.svg" alt=""></div>
        <div class="icon" *ngIf="user._id !== auth.getUserDetails()?.id" (click)="removeUser(user)"><img src="assets/images/icon-delete.svg" alt=""></div>
      </div>
    </div>

    <form [formGroup]="registerForm" class="wrapper">
      <div class="inputGroup">
        <label for="name">name</label>
        <input type="text" name="name" formControlName="name">
        <p *ngIf="formService.checkInputField(registerForm, 'name', submitted)" class="error">!</p>
      </div>
      <div class="inputGroup">
        <label for="email">email</label>
        <input type="email" name="email" formControlName="email">
        <p *ngIf="formService.checkInputField(registerForm, 'email', submitted)" class="error">!</p>
      </div>
      <div class="inputGroup">
        <label for="company">company</label>
        <select name="company" formControlName="company">
          <option value="">select company</option>
          <option *ngFor="let company of companyService.companies$ | async" [value]="company._id">{{company.name}}</option>
        </select>
        <p *ngIf="formService.checkInputField(registerForm, 'company', submitted)" class="error">!</p>
      </div>


      <div class="inputGroup">
        <label for="role">role</label>
        <select name="role" formControlName="role">
          <option value="">select role</option>
          <option *ngFor="let role of userService.getUserRoles()" [value]="role.type">{{role.name}}</option>
        </select>
        <p *ngIf="formService.checkInputField(registerForm, 'role', submitted)" class="error">!</p>
      </div>

      <div class="inputGroup right submit">
        <input type="submit" value="Annuleer" (click)="cancel()">
        <input type="submit" [value]="editState ? 'Gebruiker aanpassen' : 'Gebruiker toevoegen'" (click)="onSubmit()">
      </div>

    </form>
  `,
  styleUrls: ['./admin-user.component.scss']
})
export class AdminUserComponent {
  registerForm = this.formBuilder.group({
    _id: [''],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern(emailRegex)]],
    company: ['', Validators.required],
    role: ['', Validators.required],
  });
  submitted = false;
  editState = false;

  constructor(private formBuilder: FormBuilder,
    private api: ApiService,
    public formService: FormService,
    public companyService: CompanyService,
    public userService: UserService,
    public auth: AuthService,
    private toastr: ToastrService) { }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      this.toastr.error('Form invalid');
      return;
    }

    this.registerUser()
  }

  registerUser() {

    const formData = ngFormToFormData(this.registerForm.value);

    if (!this.registerForm.value._id) {
      formData.delete('_id');
      firstValueFrom(this.api.addUser(formData))
        .then(() => {
          this.userService.refreshUsers();
          this.registerForm.reset()
          this.toastr.success('User saved', 'Sent mail to user!');
          this.submitted = false;
        })

    } else {
      this.editState = false
      firstValueFrom(this.api.editUser(formData))
        .then(() => {
          this.userService.refreshUsers();
          this.registerForm.reset()
          this.toastr.success('User saved');
          this.submitted = false;
        })

    }


  }

  editUser(user: IUser) {
    this.editState = true

    this.registerForm.setValue({
      _id: user._id || '',
      name: user.name || '',
      email: user.email || '',
      company: user.company || '',
      role: user.role || '',
    })
  }

  cancel() {
    this.editState = false;

    this.registerForm.reset();
  }

  removeUser(user: any) {
    if (confirm(`Are you sure to delete ${user.email}?`)) {
      if (confirm(`Are you really sure you want to delete ${user.email}???`)) {
        firstValueFrom(this.api.removeUser(user._id))
          .then(() => this.userService.refreshUsers())

      }
    }
  }
}
